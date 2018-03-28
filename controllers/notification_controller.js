const config = require('../config.js')
const TelegramBot = require('node-telegram-bot-api')
const bot = new TelegramBot(config.TELEGRAM_BOT_ID)

const notificationCtrl = {
  blast: (req, res) => {
    const { message } = req.params

    if (message) {
      config.TELEGRAM_CHAT_IDS.forEach(adminId => {
        bot.sendMessage(adminId, message)
      })
    }

  }
}

module.exports = notificationCtrl
