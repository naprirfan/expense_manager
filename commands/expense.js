const Database = require('better-sqlite3');
const db = new Database('../database');

module.exports = {
  validate: function(text) {
    const textArr = text.split(' ')
    if (
      textArr.length < 3 ||
      textArr[0] !== '/expense' ||
      !textArr[1].match(/^-{0,1}\d+$/)
    ) {
      return false
    }
    return true
  },

  process: function(msg, bot) {

    // TODO: create context from session
    // Setup variables
    const textArr = msg.text.split('|')

    // Scenario 1: Haven't choose fund source
    if (textArr.length === 1) {
      let row = db.prepare('SELECT * FROM account')
      let option = {
        "parse_mode": "Markdown",
        "reply_markup": JSON.stringify({
            "one_time_keyboard": true,
            "keyboard": []
        })
      }

      return bot.sendMessage(msg.chat.id, JSON.stringify(row))
    }
    // Scenario 2: Chose fund source but haven't choose category
    else if (textArr.length === 2) {

    }
    // Scenario 3: Command complete
    else {

    }

    return bot.sendMessage(msg.chat.id, "Data berhasil disimpan")
  }
}
