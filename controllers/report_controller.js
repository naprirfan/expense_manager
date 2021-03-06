const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('db/database')
const pdf = require('html-pdf')
const ejs = require('ejs')
const exec = require('child_process').exec
const config = require('../config')
const functionHelper = require('../helper')
const TelegramBot = require('node-telegram-bot-api')
const bot = new TelegramBot(config.TELEGRAM_BOT_ID)

const reportCtrl = {
  generate: (req, res) => {
    let fromDate = new Date()
    fromDate.setDate(1)
    fromDate.setMonth(fromDate.getMonth() - 1)

    let toDate = new Date()
    toDate.setDate(1)

    const transactionQuery = `SELECT * FROM transactions 
      WHERE created_at BETWEEN '${functionHelper.formatDate(fromDate)}' AND '${functionHelper.formatDate(toDate)}'
      ORDER BY expense_category_id ASC`
    const accountQuery = 'SELECT * FROM account'
    const investmentQuery = 'SELECT * FROM investment'

    db.all(transactionQuery, (req, transactionRows) => {
      db.all(accountQuery, (req, accountRows) => {
        db.all(investmentQuery, (req, investmentRows) => {
          /**
           * For counting total income and expense
           */
          let income = 0
          let expense = 0

          /**
           * For grouping category of expense and income
           */
          let latestExpenseCategoryId = -1
          let latestIncomeCategoryId = -1

          /**
           * Array of array, each element shows grouped income/expense
           */
          let expenseParentArr = []
          let incomeParentArr = []

          /**
           * Array for holding transactionRows
           */
          let expenseArr = []
          let incomeArr = []

          transactionRows.forEach(row => {
            // Expense
            if (row.expense_category_id) {
              expense += Number(row.amount)
              if (row.expense_category_id !== latestExpenseCategoryId) {
                expenseParentArr.push(expenseArr)
                expenseArr = []
                latestExpenseCategoryId = row.expense_category_id
              }

              expenseArr.push(row)
            }
            // Income
            else {
              income += Number(row.amount)
              if (row.income_category_id !== latestIncomeCategoryId) {
                incomeParentArr.push(incomeArr)
                incomeArr = []
                latestIncomeCategoryId = row.income_category_id
              }

              incomeArr.push(row)
            }
          })

          expenseParentArr.push(expenseArr)
          incomeParentArr.push(incomeArr)

          const data = {
            period: {
              from_display: functionHelper.getPrettyFormat(fromDate),
              to_display: functionHelper.getPrettyFormat(toDate),
            },
            total_income: income,
            total_expense: expense,
            expense: expenseParentArr,
            income: incomeParentArr,
            account: accountRows,
            investment: investmentRows,
          }

          ejs.renderFile('views/report_template.ejs.html', data, {}, function(err, str){
            const options = { format: 'Letter' }
            const now = Math.floor(new Date() / 1000)

            pdf.create(str, options).toFile(`../reports/report${now}.pdf`, function(err, compiled) {
              if (err) return console.log(err)

              const cmd = `qpdf --encrypt ${config.PDF_PASSWORD} ${config.PDF_PASSWORD} 40 -- ${compiled.filename} ../reports/encrypted_report_${now}.pdf`
              exec(cmd, function (err) {
                if (err) {
                  return res.end('Error occured: ' + err)
                }
                else if (config.ENV !== 'PRODUCTION') {
                  return res.download(`../reports/encrypted_report_${now}.pdf`)
                }
                else {
                  config.TELEGRAM_CHAT_IDS.forEach(chat_id => {
                    bot.sendDocument(chat_id, `../reports/encrypted_report_${now}.pdf`)
                  })

                  setTimeout(() => {
                    return res.end('sent')
                  }, 3000)
                }


              })
            })
          })
          // INFO: End of EJS
        })
      })
    })

  },

}

module.exports = reportCtrl
