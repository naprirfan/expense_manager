const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('db/database')

const tableCtrl = {
  dump: (req, res) => {
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
  }
}

module.exports = tableCtrl
