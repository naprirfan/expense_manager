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

    // Scenario 1: Haven't choose fund source
    if (textArr.length === 1) {
      db.serialize(function() {
        db.all("SELECT * FROM account", function(err, all) {
          let keyboard = []

          let entry = []
          all.forEach(item => {
            if (item.display !== 'yes') return

            if (entry.length === 3) {
              keyboard.push(entry)
              entry = [{ text: item.name }]
            }
            else {
              entry.push({ text: item.name })
            }
          })

          // Add new account
          const newFundSource = { text: 'Tambah sumber dana baru >>'}
          if (entry.length === 3) {
            keyboard.push(entry)
            keyboard.push([newFundSource])
          }
          else {
            entry.push(newFundSource)
            keyboard.push(entry)
          }

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
