const prisma = require('../config/prisma')
const asyncHandler = require('../utils/asyncHandler')

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

const resetUserData = asyncHandler(async (req, res) => {
  const userId = Number(req.params.id)

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user || user.role !== 'STUDENT') {
    return res.status(404).json({ message: 'User not found' })
  }

  // Transactions and budgets reference categories, so they must go first or
  // the category deleteMany below would hit a foreign-key constraint.
  await prisma.$transaction([
    prisma.transaction.deleteMany({ where: { userId } }),
    prisma.budget.deleteMany({ where: { userId } }),
    prisma.savingTip.deleteMany({ where: { userId } }),
    prisma.insight.deleteMany({ where: { userId } }),
    prisma.passwordResetToken.deleteMany({ where: { userId } }),
    prisma.session.deleteMany({ where: { userId } }),
    prisma.category.deleteMany({ where: { userId } }),
  ])

  res.json({ message: 'All records for this user have been reset' })
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

module.exports = { listUsers, toggleDisableUser, resetUserData, stats }
