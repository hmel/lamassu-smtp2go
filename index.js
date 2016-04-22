var SMTPConnection = require('smtp-connection')

var OPTIONS = {
  port: 2525,
  host: 'mail.smtp2go.com',
  requireTLS: true
}

var connection = new SMTPConnection(OPTIONS)
var configuration

exports.NAME = 'SMTP2GO'
exports.SUPPORTED_MODULES = []

exports.config = function config (_config) {
  configuration = _config
}

exports.sendMessage = function sendMessage (rec) {
  console.log(configuration)
  var user = configuration.user
  var pass = configuration.pass
  var fromEmail = configuration.fromEmail
  var toEmail = rec.email.toEmail
  var subject = rec.email.subject
  var body = rec.email.body

  return new Promise(function (resolve, reject) {
    connection.connect(function () {
      connection.login({user: user, pass: pass}, function (err) {
        if (err) return reject(err)
        var envelope = {
          from: fromEmail,
          to: toEmail
        }
        var message = 'Subject: ' + subject + '\n\n' + body
        connection.send(envelope, message, function (err, info) {
          connection.quit()
          if (err) return reject(err)
          resolve()
        })
      })
    })
  })
}
