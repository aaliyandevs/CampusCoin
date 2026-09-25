const prisma = require('../config/prisma')
const asyncHandler = require('../utils/asyncHandler')
const { hashPassword, comparePassword } = require('../utils/hash')
const { signToken } = require('../utils/jwt')
const { generateResetToken, hashResetToken } = require('../utils/resetToken')
const { sendMail } = require('../utils/mailer')

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000

function toPublicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    academicYear: user.academicYear,
    monthlyAllowance: user.monthlyAllowance,
    monthlySavingsGoal: user.monthlySavingsGoal,
  }
}

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return res.status(409).json({ message: 'Email is already registered' })
  }

  const passwordHash = await hashPassword(password)
  const user = await prisma.user.create({
    data: { name, email, passwordHash, role: 'STUDENT' },
  })

  const token = signToken({ id: user.id, role: user.role })
  res.status(201).json({ token, user: toPublicUser(user) })
})

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || user.role !== 'STUDENT') {
    return res.status(401).json({ message: 'Invalid email or password' })
  }

  if (user.isDisabled) {
    return res.status(403).json({ message: 'This account has been disabled' })
  }

  const passwordMatches = await comparePassword(password, user.passwordHash)
  if (!passwordMatches) {
    return res.status(401).json({ message: 'Invalid email or password' })
  }

  const token = signToken({ id: user.id, role: user.role })
  res.json({ token, user: toPublicUser(user) })
})

const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || user.role !== 'ADMIN') {
    return res.status(401).json({ message: 'Invalid email or password' })
  }

  const passwordMatches = await comparePassword(password, user.passwordHash)
  if (!passwordMatches) {
    return res.status(401).json({ message: 'Invalid email or password' })
  }

  const token = signToken({ id: user.id, role: user.role })
  res.json({ token, user: toPublicUser(user) })
})

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body

  const user = await prisma.user.findUnique({ where: { email } })

  if (user) {
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

  res.json({ message: 'If that email is registered, a reset link has been sent.' })
})

const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body

  const tokenHash = hashResetToken(token)
  const resetToken = await prisma.passwordResetToken.findFirst({
    where: { tokenHash, usedAt: null, expiresAt: { gt: new Date() } },
  })

  if (!resetToken) {
    return res.status(400).json({ message: 'Invalid or expired reset token' })
  }

  const passwordHash = await hashPassword(password)

  await prisma.$transaction([
    prisma.user.update({
      where: { id: resetToken.userId },
      data: { passwordHash },
    }),
    prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { usedAt: new Date() },
    }),
  ])

  res.json({ message: 'Password has been reset successfully' })
})

const getMe = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.id } })
  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }
  res.json({ user: toPublicUser(user) })
})

const updateProfile = asyncHandler(async (req, res) => {
  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: req.body,
  })
  res.json({ user: toPublicUser(user) })
})

module.exports = {
  register,
  login,
  adminLogin,
  forgotPassword,
  resetPassword,
  getMe,
  updateProfile,
}
