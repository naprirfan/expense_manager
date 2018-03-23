const pdf = require('html-pdf')
const ejs = require('ejs')
const exec = require('child_process').exec
const config = require('../config.js')

module.exports = function(res, data) {
  ejs.renderFile('views/report_template.ejs.html', data, {}, function(err, str){
    const options = { format: 'Letter' }
    const now = Math.floor(new Date() / 1000)

    pdf.create(str, options).toFile(`../reports/report${now}.pdf`, function(err, compiled) {
      if (err) return console.log(err)

      const cmd = `qpdf --encrypt ${config.PDF_PASSWORD} ${config.PDF_PASSWORD} 40 -- ${compiled.filename} ../reports/encrypted_report_${now}.pdf`
      exec(cmd, function (err) {
        if (err) {
          return res.end('Error occured: ' + err)
        }
        else {
          return res.download(`../reports/encrypted_report_${now}.pdf`)
        }
      })
    })
  })
}
