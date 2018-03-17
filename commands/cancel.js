const helper = require('./_helper.js')

module.exports = {
  process: function(chat_id, input, bot) {
    helper.deleteContext(chat_id, () => bot.sendMessage(chat_id, "Perintah dibatalkan"))
  }
}
