const prisma = require('../config/prisma')
const { generateResetToken } = require('../utils/resetToken')
const { sendMail } = require('../utils/mailer')

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000

async function initiatePasswordReset(user) {
  const { rawToken, tokenHash } = generateResetToken()

  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
    },
  })

  const clientUrl = process.env.CLIENT_URL.split(',')[0].trim()
  const resetUrl = `${clientUrl}/reset-password?token=${rawToken}`
  try {
    await sendMail({
      to: user.email,
      subject: 'Reset your Campus Coin password',
      resetUrl,
      html: `<p>Click the link below to reset your password. This link expires in 1 hour.</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
    })
  } catch (err) {
    // A delivery failure (invalid recipient, provider outage, etc.) must not
    // surface to the caller - it would both 500 the request and leak whether
    // the email exists based on error vs. success behavior.
    console.error('Password reset email failed to send:', err.message)
  }
}

module.exports = { initiatePasswordReset }
