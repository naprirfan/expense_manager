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

    // TODO: create context from session
    // Setup variables
    const textArr = msg.text.split('|')

    // Scenario 1: Haven't choose fund source
    if (textArr.length === 1) {
      db.serialize(function() {
        db.all("SELECT * FROM account", function(err, all) {
          let keyboard = []

          let entry = []
          all.forEach(item => {
            if (!entry.length) entry = [{ text: item.name }]
            if (entry.length === 3) {
              keyboard.push(entry)
              entry = []
            }
            else {
              entry.push({ text: item.name })
            }
          })

          if (entry.length) keyboard.push(entry)

          var option = {
            "parse_mode": "Markdown",
            "reply_markup": JSON.stringify({
                "one_time_keyboard": true,
                "keyboard": keyboard
            })
          }

          return bot.sendMessage(msg.chat.id, 'Pilih Sumber Dana', option)
        });
      })

    }
    // Scenario 2: Chose fund source but haven't choose category
    else if (textArr.length === 2) {

    }
    // Scenario 3: Command complete
    else {
      return bot.sendMessage(msg.chat.id, "Data berhasil disimpan")
    }

  }
}
