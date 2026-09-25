const prisma = require('../config/prisma')
const asyncHandler = require('../utils/asyncHandler')
const { startOfMonth, endOfMonth } = require('../utils/date')
const { getCategorySpend } = require('../services/spend.service')

const list = asyncHandler(async (req, res) => {
  const monthStart = startOfMonth(req.validatedQuery.month ?? new Date())
  const monthEnd = endOfMonth(monthStart)

  const budgets = await prisma.budget.findMany({
    where: { userId: req.user.id, month: monthStart },
    include: { category: true },
  })

  const withConsumption = await Promise.all(
    budgets.map(async (budget) => {
      const spent = await getCategorySpend(req.user.id, budget.categoryId, monthStart, monthEnd)
      const limit = Number(budget.limitAmount)
      const percentUsed = limit > 0 ? Math.round((spent / limit) * 100) : 0
      return {
        ...budget,
        spent,
        remaining: limit - spent,
        percentUsed,
        status: spent > limit ? 'OVER' : percentUsed >= 80 ? 'NEAR' : 'OK',
      }
    }),
  )

  res.json({ budgets: withConsumption })
})

const setBudget = asyncHandler(async (req, res) => {
  const { categoryId, month, limitAmount } = req.body
  const monthStart = startOfMonth(month)

  const category = await prisma.category.findUnique({ where: { id: categoryId } })
  if (!category || (category.userId !== null && category.userId !== req.user.id)) {
    return res.status(400).json({ message: 'Category not found' })
  }
  if (category.type !== 'EXPENSE') {
    return res.status(400).json({ message: 'Budgets can only be set on expense categories' })
  }

  const existing = await prisma.budget.findFirst({
    where: { userId: req.user.id, categoryId, month: monthStart },
  })

  const budget = existing
    ? await prisma.budget.update({ where: { id: existing.id }, data: { limitAmount } })
    : await prisma.budget.create({
        data: { userId: req.user.id, categoryId, month: monthStart, limitAmount },
      })

  res.status(existing ? 200 : 201).json({ budget })
})

const update = asyncHandler(async (req, res) => {
  const budgetId = Number(req.params.id)

  const budget = await prisma.budget.findUnique({ where: { id: budgetId } })
  if (!budget || budget.userId !== req.user.id) {
    return res.status(404).json({ message: 'Budget not found' })
  }

  const updated = await prisma.budget.update({
    where: { id: budgetId },
    data: { limitAmount: req.body.limitAmount },
  })
  res.json({ budget: updated })
})

const remove = asyncHandler(async (req, res) => {
  const budgetId = Number(req.params.id)

  const budget = await prisma.budget.findUnique({ where: { id: budgetId } })
  if (!budget || budget.userId !== req.user.id) {
    return res.status(404).json({ message: 'Budget not found' })
  }

  await prisma.budget.delete({ where: { id: budgetId } })
  res.status(204).send()
})

module.exports = { list, setBudget, update, remove }
