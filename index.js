var SMTPConnection = require('smtp-connection')

var OPTIONS = {
  port: 2525,
  host: 'mail.smtp2go.com',
  requireTLS: true
}

var connection = new SMTPConnection(OPTIONS)
var configuration
var logger

exports.config = function config (_config, _logger) {
  logger = _logger
  configuration = _config
}

exports.sendMessage = function sendMessage (rec, cb) {
  var user = configuration.user
  var pass = configuration.pass
  var fromEmail = configuration.fromEmail
  var toEmail = rec.email.toEmail
  var subject = rec.email.subject
  var body = rec.email.body

  connection.connect(function () {
    connection.login({user: user, pass: pass}, function (err) {
      if (err) return logger.error(err)
      var envelope = {
        from: fromEmail,
        to: toEmail
      }
      var message = 'Subject: ' + subject + '\n\n' + body
      connection.send(envelope, message, function (err, info) {
        connection.quit()
        if (cb) cb(err)
        if (err) return logger.error(err)
        logger.debug('Successfully sent email to %s', toEmail)
      })
    })
  })
}
