const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('database')
const express = require('express')
const app = express()
const config = require('./config.js')
const telegramBaseUrl = config.TELEGRAM_API_BASE_URL + config.TELEGRAM_BOT_ID
const bodyParser = require('body-parser')
const TelegramBot = require('node-telegram-bot-api')
const bot = new TelegramBot(config.TELEGRAM_BOT_ID)

// Commands
const helpCommand = require('./commands/help')


app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static('public'))

app.get('/expense_manager', (req, res) => res.send('Hello World From Expense Manager!'))

app.post(`/expense_manager/new_message_${config.TELEGRAM_BOT_ID}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
})

bot.on('message', msg => {
  if (config.TELEGRAM_CHAT_ID.indexOf(msg.chat.id) < 0) return;

  if (msg.text === '/help' || msg.text === '/start') {
    bot.sendMessage(msg.chat.id, helpCommand)
  }
  else if (msg.startsWith('/expense')) {
    bot.sendMessage(msg.chat.id, "processing expense...")
  }
  else {
    bot.sendMessage(msg.chat.id, JSON.stringify(msg))
  }

});

app.listen(config.PORT, () => console.log(`Expense manager listening on port ${config.PORT}!`))
