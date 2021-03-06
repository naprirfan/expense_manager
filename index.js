const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('db/database')
const express = require('express')
const app = express()
const config = require('./config.js')
const bodyParser = require('body-parser')
const TelegramBot = require('node-telegram-bot-api')
const bot = new TelegramBot(config.TELEGRAM_BOT_ID)

/**
 * Controllers
 */
const reportCtrl = require('./controllers/report_controller')
const tableCtrl = require('./controllers/table_controller')
const notificationCtrl = require('./controllers/notification_controller')

/**
 * Helpers
 */
const processChat = require('./commands/index')
const availableContext = require('./commands/_available_context')

/**
 * Routes
 */
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(express.static('public'))

app.get('/expense_manager', (req, res) => res.send('Hello World From Expense Manager!'))

app.get(`/expense_manager/generate_report${config.TELEGRAM_BOT_ID}`, reportCtrl.generate)

app.get(`/expense_manager/blast${config.TELEGRAM_BOT_ID}/:message`, notificationCtrl.blast)

app.get('/expense_manager/select/:table', tableCtrl.dump)

app.post(`/expense_manager/new_message_${config.TELEGRAM_BOT_ID}`, (req, res) => {
  bot.processUpdate(req.body)
  res.sendStatus(200)
})

bot.on('message', msg => {
  if (config.TELEGRAM_CHAT_IDS.indexOf(msg.chat.id) < 0) return

  // Get context
  db.each(`SELECT * FROM context WHERE chat_id = ${msg.chat.id}`, (err, row) => {
    if (row && row.key && msg.text !== '/cancel' && availableContext.indexOf(row.key) >= 0) {
      try {
        processChat(bot, msg, row.value + '|' + msg.text)
      }
      catch(error) {
        commandHelper.deleteContext(msg.chat.id, () => bot.sendMessage(msg.chat.id, "Perintah dibatalkan"))
      }

    }
    else {
      processChat(bot, msg, msg.text)
    }
  })

})

app.listen(config.PORT, () => console.log(`Expense manager listening on port ${config.PORT}!`))
