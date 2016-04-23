var SMTPConnection = require('smtp-connection')

var OPTIONS = {
  port: 2525,
  host: 'mail.smtp2go.com',
  requireTLS: true
}

var configuration

exports.NAME = 'SMTP2GO'
exports.SUPPORTED_MODULES = []

exports.config = function config (_config) {
  configuration = _config
}

exports.sendMessage = function sendMessage (rec) {
  console.log('DEBUG63')

  var user = configuration.user
  var pass = configuration.pass
  var fromEmail = configuration.fromEmail
  var toEmail = configuration.toEmail
  var subject = rec.email.subject
  var body = rec.email.body

  console.log('DEBUG64')
  var connection = new SMTPConnection(OPTIONS)

  return new Promise(function (resolve, reject) {
    console.log('DEBUG65')
    connection.connect(function (err) {
      if (err) return reject(err)
      console.log('DEBUG66')
      connection.login({user: user, pass: pass}, function (err) {
        console.log('DEBUG67')
        if (err) return reject(err)
        var envelope = {
          from: fromEmail,
          to: toEmail
        }
        var message = 'Subject: ' + subject + '\n\n' + body
        console.log('DEBUG60')
        connection.send(envelope, message, function (err, info) {
          console.log('DEBUG61')
          connection.quit()
          if (err) return reject(err)
          console.log('DEBUG62')
          resolve()
        })
      })
    })
  })
}
