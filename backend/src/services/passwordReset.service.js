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

  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${rawToken}`
  await sendMail({
    to: user.email,
    subject: 'Reset your Campus Coin password',
    html: `<p>Click the link below to reset your password. This link expires in 1 hour.</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
  })
}

module.exports = { initiatePasswordReset }
