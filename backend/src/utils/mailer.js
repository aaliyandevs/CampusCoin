const nodemailer = require('nodemailer')

let transporterPromise = null

function getTransporter() {
  if (!transporterPromise) {
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
  return transporterPromise
}

async function sendMail({ to, subject, html }) {
  const transporter = await getTransporter()
  const info = await transporter.sendMail({
    from: '"Campus Coin" <no-reply@campuscoin.local>',
    to,
    subject,
    html,
  })
  const previewUrl = nodemailer.getTestMessageUrl(info)
  console.log(`Email preview: ${previewUrl}`)
  return previewUrl
}

module.exports = { sendMail }
