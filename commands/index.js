/**
 * Commands
 */
const helpCommand = require('./help')
const expenseCommand = require('./expense')
const koreksiCommand = require('./koreksi')
const setInvestmentCommand = require('./set_investment')
const incomeCommand = require('./income')
const transferCommand = require('./transfer')
const queryCommand = require('./query')
const cancelCommand = require('./cancel')
const commandHelper = require('./_command_helper')

module.exports = function(bot, msg, input) {
  if (input === '/help' || input === '/start') {
    bot.sendMessage(msg.chat.id, helpCommand)
  }
  else if (input.startsWith('/cancel')) {
    return cancelCommand.process(msg.chat.id, input, bot)
  }
  else if (input.startsWith('/koreksi')) {
    return koreksiCommand.process(msg.chat.id, input, bot)
  }
  else if (input.startsWith('/set_investment')) {
    return setInvestmentCommand.process(msg.chat.id, input, bot)
  }
  else if (input.startsWith('/query')) {
    // Validate
    if (queryCommand.validate(input)) {
      return queryCommand.process(msg.chat.id, input, bot)
    }

    const errorMessage = `Format salah. Pastikan perintah mengikuti format sebagai berikut: /query [query] tanpa tanda kurung`
    return bot.sendMessage(msg.chat.id, errorMessage)
  }
  else if (input.startsWith('/transfer')) {
    // Validate
    if (transferCommand.validate(input)) {
      return transferCommand.process(msg.chat.id, input, bot)
    }

    const errorMessage = `Format salah. Pastikan perintah mengikuti format sebagai berikut: /transfer [jumlah] [keterangan] tanpa tanda kurung`
    return bot.sendMessage(msg.chat.id, errorMessage)
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
