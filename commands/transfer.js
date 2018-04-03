const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('db/database')
const commandHelper = require('./_command_helper')

module.exports = {
  validate: function(text) {
    const textArr = text.split(' ')
    if (
      textArr.length < 3 ||
      textArr[0] !== '/transfer' ||
      !textArr[1].match(/^-{0,1}\d+$/)
    ) {
      return false
    }
    return true
  },

  process: function(chat_id, input, bot) {

    // Setup variables
    const textArr = input.split('|')

    // Scenario 1: Haven't choose "FROM" fund source
    if (textArr.length === 1) {
      db.serialize(function() {
        db.all("SELECT * FROM account", function(err, all) {

          let collection = all.filter(item => item.display === 'yes')
          let option = commandHelper.enrichKeyboard(collection)

          commandHelper.updateContext(chat_id, 'transfer', input, () => {
            return bot.sendMessage(chat_id, 'Pilih sumber dana. Klik /cancel untuk membatalkan', option)
          })

        });
      })
    }
    // Scenario 2: Chose "FROM" fund source but haven't choose "TO" fund source
    else if (textArr.length === 2) {
      db.serialize(function() {
        db.all("SELECT * FROM account", function(err, all) {

          let collection = all.filter(item => item.display === 'yes')
          let option = commandHelper.enrichKeyboard(collection)

          commandHelper.updateContext(chat_id, 'transfer', input, () => {
            return bot.sendMessage(chat_id, 'Pilih tujuan transfer. Klik /cancel untuk membatalkan', option)
          })

        });
      })
    }
    // Scenario 3: Command complete
    else {

      // Extract name & amount
      let arr0 = textArr[0].split(' ')
      let nameArr = []
      for (let i = 2; i < arr0.length; i++) nameArr.push(arr0[i])
      let name = nameArr.join(' ')
      let amount = arr0[1]

      // Extract account ID & name
      let arr1 = textArr[1].split('~')
      let from_account_id = arr1[0]
      let from_account_name = arr1[1]

      // Extract income category ID & income category name
      let arr2 = textArr[2].split('~')
      let to_account_id = arr2[0]
      let to_account_name = arr2[1]

      db.serialize(function() {
        db.run(`INSERT INTO transfers
          (
            name,
            amount,
            from_account_id,
            to_account_id,
            from_account_name,
            to_account_name,
            created_at
          )
          VALUES
          (
            "${name}",
            ${amount},
            ${from_account_id},
            ${to_account_id},
            "${from_account_name}",
            "${to_account_name}",
            "${new Date()}"
          )
        `
        );

        db.run(`UPDATE account SET amount = amount - ${amount} WHERE id = ${from_account_id}`)
        db.run(`UPDATE account SET amount = amount + ${amount} WHERE id = ${to_account_id}`)
        commandHelper.deleteContext(chat_id, () => bot.sendMessage(chat_id, "Data berhasil disimpan"))

      })
    }

  }
}
