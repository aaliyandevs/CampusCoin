const prisma = require('../config/prisma')
const asyncHandler = require('../utils/asyncHandler')
const { initiatePasswordReset } = require('../services/passwordReset.service')

const listUsers = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany({
    where: { role: 'STUDENT' },
    select: {
      id: true,
      name: true,
      email: true,
      academicYear: true,
      isDisabled: true,
      createdAt: true,
      _count: { select: { transactions: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
  res.json({ users })
})

const toggleDisableUser = asyncHandler(async (req, res) => {
  const userId = Number(req.params.id)

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user || user.role !== 'STUDENT') {
    return res.status(404).json({ message: 'User not found' })
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { isDisabled: !user.isDisabled },
  })
  res.json({ user: { id: updated.id, isDisabled: updated.isDisabled } })
})

const resetUserPassword = asyncHandler(async (req, res) => {
  const userId = Number(req.params.id)

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user || user.role !== 'STUDENT') {
    return res.status(404).json({ message: 'User not found' })
  }

  await initiatePasswordReset(user)
  res.json({ message: 'A password reset link has been sent to the user' })
})

const stats = asyncHandler(async (req, res) => {
  const [activeUsers, totalTransactions, categoryGroups] = await Promise.all([
    prisma.user.count({ where: { role: 'STUDENT', isDisabled: false } }),
    prisma.transaction.count(),
    prisma.transaction.groupBy({
      by: ['categoryId'],
      _count: { categoryId: true },
      orderBy: { _count: { categoryId: 'desc' } },
      take: 5,
    }),
  ])

  const categories = await prisma.category.findMany({
    where: { id: { in: categoryGroups.map((g) => g.categoryId) } },
  })
  const categoryById = new Map(categories.map((c) => [c.id, c]))

  const mostUsedCategories = categoryGroups.map((g) => ({
    categoryId: g.categoryId,
    categoryName: categoryById.get(g.categoryId)?.name ?? 'Unknown',
    transactionCount: g._count.categoryId,
  }))

  res.json({ activeUsers, totalTransactions, mostUsedCategories })
})

module.exports = { listUsers, toggleDisableUser, resetUserPassword, stats }
