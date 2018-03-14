module.exports = {
  enrichKeyboard: function(collection, additonal_text) {
    let keyboard = []

    let entry = []
    collection.forEach(item => {
      if (entry.length === 3) {
        keyboard.push(entry)
        entry = [{ text: item.name }]
      }
      else {
        entry.push({ text: item.name })
      }
    })

    // Add new account
    const additionalText = { text: additonal_text}
    if (entry.length === 3) {
      keyboard.push(entry)
      keyboard.push([additionalText])
    }
    else {
      entry.push(additionalText)
      keyboard.push(entry)
    }

    return {
      "parse_mode": "Markdown",
      "reply_markup": JSON.stringify({
          "one_time_keyboard": true,
          "keyboard": keyboard
      })
    }
  }
}
