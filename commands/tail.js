const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('db/database')
const commandHelper = require('./_command_helper.js')
const functionHelper = require('../helper')

module.exports = {
  process: function(chat_id, input, bot) {
    // Setup variables
    const query = 'SELECT * FROM transactions ORDER BY id DESC LIMIT 10'
    db.all(query, (err, rows) => {
      if (err) return bot.sendMessage(chat_id, "Error: " + err)

      // Build message
      let msgArr = []
      rows.forEach(row => {
        let msg = []
        msg.push(`Name: ${row.name}`)
        msg.push(`Amount: ${functionHelper.formatMoney(row.amount)}`)

        if (row.expense_category_id) {
          msg.push(`Category: ${row.expense_category_name}`)
        }

        if (row.income_category_id) {
          msg.push(`Category: ${row.income_category_name}`)
        }

        msg.push(`Sumber dana: ${row.account_name}`)
        msg.push(`Created At: ${row.created_at}`)

        msgArr.push(msg.join("\n"))
      })

      let message = msgArr.join("\n\n")

      commandHelper.deleteContext(chat_id, () => {
        bot.sendMessage(chat_id, message)
      })
    })

  }
}
