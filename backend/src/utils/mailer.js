const nodemailer = require('nodemailer')

const EMAILJS_ENDPOINT = 'https://api.emailjs.com/api/v1.0/email/send'

let transporterPromise = null

async function sendViaEmailJs({ to, subject, resetUrl, html }) {
  const response = await fetch(EMAILJS_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      service_id: process.env.EMAILJS_SERVICE_ID,
      template_id: process.env.EMAILJS_TEMPLATE_ID,
      user_id: process.env.EMAILJS_PUBLIC_KEY,
      accessToken: process.env.EMAILJS_PRIVATE_KEY,
      template_params: {
        to_email: to,
        subject,
        reset_url: resetUrl,
        message: html,
      },
    }),
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`EmailJS request failed (${response.status}): ${body}`)
  }
}

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

async function sendMail({ to, subject, html, resetUrl }) {
  if (process.env.EMAILJS_SERVICE_ID) {
    await sendViaEmailJs({ to, subject, resetUrl, html })
    return null
  }

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
