const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('database')
const helper = require('./_helper.js')

module.exports = {
  process: function(chat_id, input, bot) {
    // Setup variables
    const textArr = input.split('|')

    // Scenario 1: Haven't choose fund source
    if (textArr.length === 1) {
      db.serialize(function() {
        db.all("SELECT * FROM account", function(err, all) {

          let collection = all.filter(item => item.display === 'yes')
          let option = helper.enrichKeyboard(collection, 'Tambah sumber dana baru >>')

          helper.updateContext(chat_id, 'expense', input, () => {
            return bot.sendMessage(chat_id, 'Pilih Sumber Dana', option)
          })

        });
      })

    }
    // Scenario 2: Chose fund source but haven't choose category
    else if (textArr.length === 2) {
      helper.updateContext(chat_id, 'expense', input, () => {
        return bot.sendMessage(chat_id, 'Masukkan jumlah dana')
      })
    }
    // Scenario 3: Command complete
    else {

      // Extract account ID & name
      let arr1 = textArr[1].split('-')
      let account_id = arr1[0]
      let account_name = arr1[1]

      // Extract amount
      let amount = textArr[2]

      db.serialize(function() {
        db.run(`UPDATE account SET amount = ${amount} WHERE id = ${account_id}`, (err, row) => {
          helper.deleteContext(chat_id, () => bot.sendMessage(chat_id, "Data berhasil disimpan"))
        })
      })
    }

  }
}
