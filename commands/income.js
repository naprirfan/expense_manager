const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('db/database')
const commandHelper = require('./_command_helper')
const functionHelper = require('../helper')

module.exports = {
  validate: function(text) {
    const textArr = text.split(' ')
    if (
      textArr.length < 3 ||
      textArr[0] !== '/income' ||
      !textArr[1].match(/^-{0,1}\d+$/)
    ) {
      return false
    }
    return true
  },

  process: function(chat_id, input, bot) {

    // Setup variables
    const textArr = input.split('|')

    // Scenario 1: Haven't choose fund source
    if (textArr.length === 1) {
      db.serialize(function() {
        db.all("SELECT * FROM account", function(err, all) {

          let collection = all.filter(item => item.display === 'yes')
          let option = commandHelper.enrichKeyboard(collection)

          commandHelper.updateContext(chat_id, 'income', input, () => {
            return bot.sendMessage(chat_id, 'Pilih ke mana dana masuk. Klik /cancel untuk membatalkan', option)
          })

        });
      })

    }
    // Scenario 2: Chose fund source but haven't choose income category
    else if (textArr.length === 2) {
      db.serialize(function() {
        db.all("SELECT * FROM income_category", function(err, all) {

          let option = commandHelper.enrichKeyboard(all)
          commandHelper.updateContext(chat_id, 'income', input, () => {
            return bot.sendMessage(chat_id, 'Pilih Kategori Pemasukanmu. Klik /cancel untuk membatalkan', option)
          })

        })
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
      let account_id = arr1[0]
      let account_name = arr1[1]

      // Extract income category ID & income category name
      let arr2 = textArr[2].split('~')
      let income_category_id = arr2[0]
      let income_category_name = arr2[1]

      db.serialize(function() {
        db.run(`INSERT INTO transactions
          (
            name,
            amount,
            created_by,
            income_category_id,
            account_id,
            income_category_name,
            account_name,
            created_at
          )
          VALUES
          (
            "${name}",
            ${amount},
            ${chat_id},
            "${income_category_id}",
            ${account_id},
            "${income_category_name}",
            "${account_name}",
            "${functionHelper.formatDate(new Date())}"
          )
        `
        );

        db.run(`UPDATE account SET amount = amount + ${amount} WHERE id = ${account_id}`, (err, row) => {
          commandHelper.deleteContext(chat_id, () => bot.sendMessage(chat_id, "Data berhasil disimpan"))
        })
      })
    }

  }
}
