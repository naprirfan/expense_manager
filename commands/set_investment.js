const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('db/database')
const helper = require('./_command_helper.js')

const investment_values = [
  {
    id: 1,
    name: 'Base value',
    value: 'base_value',
  },
  {
    id: 2,
    name: 'Current value',
    value: 'current_value',
  }
]

module.exports = {

  process: function(chat_id, input, bot) {
    // Setup variables
    const textArr = input.split('|')

    // Scenario 1: Haven't choose investment type
    if (textArr.length === 1) {
      db.serialize(function() {
        db.all("SELECT * FROM investment", function(err, all) {

          let option = helper.enrichKeyboard(all)

          helper.updateContext(chat_id, 'set_investment', input, () => {
            return bot.sendMessage(chat_id, 'Pilih Jenis Investasi. Klik /cancel untuk membatalkan', option)
          })

        });
      })

    }
    // Scenario 2: Chose investment type but hadn't chose current/base value
    else if (textArr.length === 2) {
      let option = helper.enrichKeyboard(investment_values)

      helper.updateContext(chat_id, 'set_investment', input, () => {
        return bot.sendMessage(chat_id, 'Pilih nilai yang akan diupdate. Klik /cancel untuk membatalkan', option)
      })
    }
    // Scenario 3: Chose value type
    else if (textArr.length === 3) {
      helper.updateContext(chat_id, 'set_investment', input, () => {
        return bot.sendMessage(chat_id, 'Masukkan jumlah dana. Klik /cancel untuk membatalkan')
      })
    }
    // Scenario 4: Command complete
    else {

      // /set_investment|1~saham|1~Base value|600000
      // Extract investment ID & name
      let arr = textArr[1].split('~')
      let investment_id = arr[0]

      // Extract which value to be updated
      arr = textArr[2].split('~')
      let updated_value = investment_values.filter(item => item.id === Number(arr[0]))[0]['value']

      // Extract amount
      let amount = Number(textArr[3])

      db.serialize(function() {
        db.run(`UPDATE investment SET ${updated_value} = ${amount} WHERE id = ${investment_id}`, (err, row) => {
          helper.deleteContext(chat_id, () => bot.sendMessage(chat_id, "Data berhasil disimpan"))
        })
      })
    }
  }
}
