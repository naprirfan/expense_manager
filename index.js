const express = require('express')
const app = express()
const config = require('./config.js')
const telegramBaseUrl = config.TELEGRAM_API_BASE_URL + config.TELEGRAM_BOT_ID
const bodyParser = require('body-parser')
const TelegramBot = require('node-telegram-bot-api')
const bot = new TelegramBot(config.TELEGRAM_BOT_ID)

// Commands
const helpCommand = require('./commands/help')
const expenseCommand = require('./commands/expense')


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
  // if (config.TELEGRAM_CHAT_ID.indexOf(msg.chat.id) < 0) return;

  // Get context
  db.run(`SELECT * FROM context WHERE chat_id = ${msg.chat.id}`, (err, row) => {
    if (row.key && (row.key === 'expense' || row.key === 'income')) {
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
  else if (input.startsWith('/expense')) {

    // Validate
    if (expenseCommand.validate(input)) {
      return expenseCommand.process(msg.chat.id, input, bot)
    }

    const errorMessage = `Format salah. Pastikan perintah mengikuti format sebagai berikut: /expense [harga] [nama_barang] tanpa tanda kurung`
    return bot.sendMessage(msg.chat.id, errorMessage)
  }
  else if (input.startsWith('/income')) {
    bot.sendMessage(msg.chat.id, "processing income...")
  }
  else {
    bot.sendMessage(msg.chat.id, JSON.stringify(msg))
  }
}

app.listen(config.PORT, () => console.log(`Expense manager listening on port ${config.PORT}!`))
