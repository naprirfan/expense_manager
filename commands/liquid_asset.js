const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('db/database')
const helper = require('./_command_helper.js')

module.exports = {
  process: function(chat_id, input, bot) {
    // Setup variables
    const query = 'SELECT * FROM account'
    db.all(query, (err, rows) => {
      if (err) return bot.sendMessage(chat_id, "Error: " + err)

      // Build message
      let msgArr = []
      rows.forEach(row => {
        let msg = `Name: ${row.name}
Amount: ${row.amount}
        `
        msgArr.push(msg)
      })

      let message = msgArr.join("\n")

      helper.deleteContext(chat_id, () => {
        bot.sendMessage(chat_id, message)
      })
    })

  }
}
