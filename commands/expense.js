const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('database')

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
    // Setup variables
    const textArr = msg.text.split('|')
    var option = {
      "parse_mode": "Markdown",
      "reply_markup": JSON.stringify({
          "one_time_keyboard": true,
          "keyboard": []
      })
    }

    // Scenario 1: Haven't choose fund source
    if (!textArr.length) {
      let keyboard = []

      db.serialize(function() {
        db.each("SELECT * FROM account", function(err, row) {
          keyboard.push(row.name)
        });
      })

      option.reply_markup.keyboard = keyboard
      return bot.sendMessage(msg.chat.id, "Tolong pilih sumber dana", option)
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
