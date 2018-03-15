const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./database/database')
const express = require('express')
const app = express()
const config = require('./config.js')
const telegramBaseUrl = config.TELEGRAM_API_BASE_URL + config.TELEGRAM_BOT_ID
const bodyParser = require('body-parser')
const TelegramBot = require('node-telegram-bot-api')
const bot = new TelegramBot(config.TELEGRAM_BOT_ID)

// Context & Commands
const availableContext = [
  'expense',
  'income',
  'koreksi',
]
const helpCommand = require('./commands/help')
const expenseCommand = require('./commands/expense')
const koreksiCommand = require('./commands/koreksi')
const incomeCommand = require('./commands/income')

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static('public'))

app.get('/expense_manager', (req, res) => res.send('Hello World From Expense Manager!'))

app.get('/expense_manager/select/:table', (req, res) => {
  db.all(`SELECT * FROM ${req.params.table}`, (err, row) => {
    return res.json(row)
  })
})

app.post(`/expense_manager/new_message_${config.TELEGRAM_BOT_ID}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
})

bot.on('message', msg => {
  // if (config.TELEGRAM_CHAT_ID.indexOf(msg.chat.id) < 0) return;

  // Get context
  db.each(`SELECT * FROM context WHERE chat_id = ${msg.chat.id}`, (err, row) => {
    if (row && row.key && availableContext.indexOf(row.key) >= 0) {
      processChat(bot, msg, row.value + '|' + msg.text)
    }
    else {
      processChat(bot, msg, msg.text)
    }
  })

});

const processChat = function(bot, msg, input) {
  if (input === '/help' || input === '/start') {
    bot.sendMessage(msg.chat.id, helpCommand)
  }
  else if (input.startsWith('/koreksi')) {
    return koreksiCommand.process(msg.chat.id, input, bot)
  }
  else if (input.startsWith('/expense')) {
    // Validate
    if (expenseCommand.validate(input)) {
      return expenseCommand.process(msg.chat.id, input, bot)
    }

    const errorMessage = `Format salah. Pastikan perintah mengikuti format sebagai berikut: /expense [harga] [nama_barang] tanpa tanda kurung`
    return bot.sendMessage(msg.chat.id, errorMessage)
  }
  else if (input.startsWith('/income')) {
    // Validate
    if (incomeCommand.validate(input)) {
      return incomeCommand.process(msg.chat.id, input, bot)
    }

    const errorMessage = `Format salah. Pastikan perintah mengikuti format sebagai berikut: /income [harga] [nama_barang] tanpa tanda kurung`
    return bot.sendMessage(msg.chat.id, errorMessage)
  }
  else {
    bot.sendMessage(msg.chat.id, JSON.stringify(msg))
  }
}

app.listen(config.PORT, () => console.log(`Expense manager listening on port ${config.PORT}!`))
