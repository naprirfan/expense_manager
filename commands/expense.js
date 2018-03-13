module.exports = {
  validate: function(text) {
    const textArr = text.split(' ')
    if (
      textArr.length < 3 ||
      textArr[0] !== '/expense' ||
      !textArr[1].match(/^-{0,1}\d+$/)
    ) {
      return false
    }
    return true
  },

  process: function(msg, bot) {
    var option = {
      "parse_mode": "Markdown",
      "reply_markup": JSON.stringify({
          "hide_keyboard": true,
          "keyboard": [
            [{ text: "Yes" }],
            [{ text: "No" }]
          ]
      })
    }

    return bot.sendMessage(msg.chat.id, "processing expense...", option)
  }
}
