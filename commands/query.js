const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('db/database')
const helper = require('./_command_helper.js')

module.exports = {
  validate: function(text) {
    const textArr = text.split(' ')
    if (
      textArr.length < 2 ||
      textArr[0] !== '/query' ||
      !textArr[1].toLowerCase().startsWith('insert') ||
      !textArr[1].toLowerCase().startsWith('update')
    ) {
      return false
    }
    return true
  },

  process: function(chat_id, input, bot) {
    // Setup variables
    const textArr = input.split(' ')
    let queryArr = []
    for (let i = 1; i < textArr.length; i++) queryArr.push(arr0[i])
    let query = queryArr.join(' ')

    db.run(query, (err, row) => {
      helper.deleteContext(chat_id, () => bot.sendMessage(chat_id, "Query executed"))
    })

  }
}
