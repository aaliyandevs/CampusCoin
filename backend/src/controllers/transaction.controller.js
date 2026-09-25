const prisma = require('../config/prisma')
const asyncHandler = require('../utils/asyncHandler')
const { generateDueRecurringTransactions } = require('../services/recurring.service')
const { addInterval } = require('../utils/date')

async function assertCategoryUsable(categoryId, userId, type) {
  const category = await prisma.category.findUnique({ where: { id: categoryId } })
  if (!category || (category.userId !== null && category.userId !== userId)) {
    return { error: 'Category not found' }
  }
  if (category.type !== type) {
    return { error: 'Category type does not match transaction type' }
  }
  return { category }
}

const list = asyncHandler(async (req, res) => {
  await generateDueRecurringTransactions(req.user.id)

  const { startDate, endDate, categoryId, type } = req.query

  const where = {
    userId: req.user.id,
    ...(startDate || endDate
      ? { date: { ...(startDate && { gte: startDate }), ...(endDate && { lte: endDate }) } }
      : {}),
    ...(categoryId && { categoryId }),
    ...(type && { type }),
  }

  const transactions = await prisma.transaction.findMany({
    where,
    include: { category: true },
    orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
  })

  res.json({ transactions })
})

const create = asyncHandler(async (req, res) => {
  const { categoryId, amount, type, description, date, isRecurringTemplate, recurrenceInterval } =
    req.body

  const { error } = await assertCategoryUsable(categoryId, req.user.id, type)
  if (error) {
    return res.status(400).json({ message: error })
  }

  const transaction = await prisma.transaction.create({
    data: {
      userId: req.user.id,
      categoryId,
      amount,
      type,
      description,
      date,
      isRecurringTemplate: Boolean(isRecurringTemplate),
      recurrenceInterval: isRecurringTemplate ? recurrenceInterval : null,
      nextOccurrenceDate: isRecurringTemplate ? addInterval(date, recurrenceInterval) : null,
    },
    include: { category: true },
  })

  res.status(201).json({ transaction })
})

const update = asyncHandler(async (req, res) => {
  const transactionId = Number(req.params.id)

  const transaction = await prisma.transaction.findUnique({ where: { id: transactionId } })
  if (!transaction || transaction.userId !== req.user.id) {
    return res.status(404).json({ message: 'Transaction not found' })
  }

  const nextType = req.body.type ?? transaction.type
  if (req.body.categoryId) {
    const { error } = await assertCategoryUsable(req.body.categoryId, req.user.id, nextType)
    if (error) {
      return res.status(400).json({ message: error })
    }
  }

  const updated = await prisma.transaction.update({
    where: { id: transactionId },
    data: req.body,
    include: { category: true },
  })

  res.json({ transaction: updated })
})

const remove = asyncHandler(async (req, res) => {
  const transactionId = Number(req.params.id)

  const transaction = await prisma.transaction.findUnique({ where: { id: transactionId } })
  if (!transaction || transaction.userId !== req.user.id) {
    return res.status(404).json({ message: 'Transaction not found' })
  }

  await prisma.transaction.delete({ where: { id: transactionId } })
  res.status(204).send()
})

module.exports = { list, create, update, remove }
