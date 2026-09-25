const nodemailer = require('nodemailer')

let transporterPromise = null

function getTransporter() {
  if (!transporterPromise) {
    if (process.env.SMTP_HOST) {
      transporterPromise = Promise.resolve(
        nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT || 587),
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        }),
      )
    } else {
      transporterPromise = nodemailer.createTestAccount().then((testAccount) =>
        nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        }),
      )
    }
  }
  return transporterPromise
}

async function sendMail({ to, subject, html }) {
  const transporter = await getTransporter()
  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM || '"Campus Coin" <no-reply@campuscoin.local>',
    to,
    subject,
    html,
  })
  const previewUrl = nodemailer.getTestMessageUrl(info)
  if (previewUrl) {
    console.log(`Email preview: ${previewUrl}`)
  }
  return previewUrl
}

module.exports = { sendMail }
