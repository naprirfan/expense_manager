const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('../database/database')

module.exports = {
  enrichKeyboard: function(collection, additonal_text) {
    let keyboard = []

    let entry = []
    collection.forEach(item => {
      if (entry.length === 3) {
        keyboard.push(entry)
        entry = [{ text: item.id + '~' + item.name }]
      }
      else {
        entry.push({ text: item.id + '~' + item.name })
      }
    })

    // Add new account
    const additionalText = { text: additonal_text}
    if (entry.length === 3) {
      keyboard.push(entry)
      keyboard.push([additionalText])
    }
    else {
      entry.push(additionalText)
      keyboard.push(entry)
    }

    return {
      "parse_mode": "Markdown",
      "reply_markup": JSON.stringify({
          "one_time_keyboard": true,
          "keyboard": keyboard
      })
    }
  },

  deleteContext: function(chat_id, callback) {
    this.updateContext(chat_id, '', '', callback)
  },

  updateContext: function(chat_id, key, val, callback) {
    db.run(`UPDATE context SET key = '${key}', value = '${val}' WHERE chat_id = ${chat_id}`, (err, row) => {
      if (err) throw "Error"
      callback()
    })
  },
}
