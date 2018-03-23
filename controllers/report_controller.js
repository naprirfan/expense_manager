const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('db/database')
const createPDF = require('../helpers/create_pdf')
const thousandSeparator = require('../helpers/thousand_separator')

const reportCtrl = {
  generate: (req, res) => {

    const from_date = '2018-03-01'
    const to_date = '2018-03-31'
    const query = `SELECT * FROM transactions ORDER BY expense_category_id ASC`

    db.all(query, (req, rows) => {
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
       * Array for holding rows
       */
      let expenseArr = []
      let incomeArr = []

      rows.forEach(row => {
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

      let diff = thousandSeparator(Math.abs(income - expense))
      let total_summary = income - expense >= 0 ? `+ Rp${diff}` : `- Rp${diff}`

      const data = {
        period: {
          from_display: '27 Agustus 2000',
          to_display: '26 September 2001',
        },
        total_income: `Rp${thousandSeparator(income)}`,
        total_expense: `Rp${thousandSeparator(expense)}`,
        total_summary: total_summary,
        expense: expenseParentArr,
        income: incomeParentArr,
      }

      createPDF(res, data)
    })

  }
}

module.exports = reportCtrl
