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
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static('public'))

app.get('/expense_manager', (req, res) => res.send('Hello World!'))

app.post(`/expense_manager/new_message_${config.TELEGRAM_BOT_ID}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
})

bot.on('message', msg => {
  bot.sendMessage(msg.chat.id, 'I am alive!')
});

app.listen(config.PORT, () => console.log(`Expense manager listening on port ${config.PORT}!`))
