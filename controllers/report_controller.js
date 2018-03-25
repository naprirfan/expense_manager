const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('db/database')
const createPDF = require('../helpers/create_pdf')

const reportCtrl = {
  generate: (req, res) => {

    const from_date = '2018-03-01'
    const to_date = '2018-03-31'
    const transactionQuery = `SELECT * FROM transactions ORDER BY expense_category_id ASC`
    const accountQuery = 'SELECT * FROM account'

    db.all(transactionQuery, (req, transactionRows) => {
      db.all(accountQuery, (req, accountRows) => {
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
            from_display: '27 Agustus 2000',
            to_display: '26 September 2001',
          },
          total_income: income,
          total_expense: expense,
          expense: expenseParentArr,
          income: incomeParentArr,
          account: accountRows,
        }

        createPDF(res, data)
      })
    })

  }
}

module.exports = reportCtrl
