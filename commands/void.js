const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('db/database')
const helper = require('./_command_helper.js')

module.exports = {
  validate: function(text) {
    const textArr = text.split(' ')
    if (
      textArr.length < 2 ||
      textArr[0] !== '/void' ||
      !textArr[1].match(/^-{0,1}\d+$/)
    ) {
      return false
    }
    return true
  },

  process: function(chat_id, input, bot) {

    // Setup variables
    const textArr = input.split('|')

    // Scenario 1: Haven't confirmed
    if (textArr.length === 1) {

      let inputArr = input.split(' ')
      let trxId = inputArr[1]

      db.serialize(function() {
        db.all(`SELECT * FROM transactions WHERE id = ${trxId}`, function(err, all) {

          if (err || !all.length) return helper.deleteContext(chat_id, () => bot.sendMessage(chat_id, "Data tidak ditemukan"))

          helper.updateContext(chat_id, 'void', input, () => {
            return bot.sendMessage(chat_id, `
              Berikut adalah detail transaksi:

              ID: ${all[0]['id']}
              Name: ${all[0]['name']}
              Amount: ${all[0]['amount']}
              Expense category name: ${all[0]['expense_category_name']}
              Income category name: ${all[0]['income_category_name']}
              Created at: ${all[0]['created_at']}

              Ketik "Y" untuk melanjutkan proses void.

              Klik /cancel untuk membatalkan`, option)
          })

        });
      })
    }
    // Scenario 3: Command complete
    else {

      // Extract trxId
      let arr0 = textArr[0].split(' ')
      let trxId = arr0[1]

      // Extract confirmation
      let confirmation = textArr[1].toLowerCase()

      if (confirmation !== 'y') {
        return helper.deleteContext(chat_id, () => bot.sendMessage(chat_id, "Perintah dibatalkan"))
      }

      db.serialize(function() {
        db.run(`DELETE FROM transactions WHERE id = ${trxId}`, (err, row) => {
          helper.deleteContext(chat_id, () => bot.sendMessage(chat_id, "Data berhasil disimpan"))
        })
      })
    }

  }
}
