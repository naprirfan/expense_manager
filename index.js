const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('db/database')
const express = require('express')
const app = express()
const config = require('./config.js')
const telegramBaseUrl = config.TELEGRAM_API_BASE_URL + config.TELEGRAM_BOT_ID
const bodyParser = require('body-parser')
const TelegramBot = require('node-telegram-bot-api')
const bot = new TelegramBot(config.TELEGRAM_BOT_ID)

/**
 * Helpers
 */
const processChat = require('./helpers/process_chat')
const createPDF = require('./helpers/create_pdf')
const availableContext = [
  'expense',
  'income',
  'koreksi',
  'transfer',
]

/**
 * Routes
 */
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(express.static('public'))

app.get(`/expense_manager/generate_report${config.TELEGRAM_BOT_ID}`, (req, res) => {

  const from_date = '2018-03-01'
  const to_date = '2018-03-31'
  const query = `SELECT * FROM transactions`

  db.all(query, (req, rows) => {
    console.log(rows)

    let income = 0
    let expense = 0
    rows.forEach(row => {
      // Expense
      if (row.expense_category_id) {
        expense += Number(row.amount)
      }
      // Income
      else {
        income += Number(row.amount)
      }
    })

    let diff = Math.abs(income - expense)
    let total_summary = income - expense >= 0 ? `+ Rp${diff}` : `- Rp${diff}`

    const data = {
      period: {
        from_display: '27 Agustus 2000',
        to_display: '26 September 2001',
      },
      total_income: `Rp${income}`,
      total_expense: `Rp${expense}`,
      total_summary: total_summary,
    }

    createPDF(res, data)
  })

})

app.get('/expense_manager', (req, res) => res.send('Hello World From Expense Manager!'))

app.get('/expense_manager/select/:table', (req, res) => {
  db.all(`SELECT * FROM ${req.params.table}`, (err, row) => {
    if (req.query.format) {
      let textArr = []
      row.forEach(item => {
        for (let key in item) {
          textArr.push(`${key}: ${item[key]}`)
        }
        textArr.push('------------')
      })
      let text = textArr.join("\n")
      return res.end(text)
    }
    else {
      return res.json(row)
    }
  })
})

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
