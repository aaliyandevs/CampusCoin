const prisma = require('../config/prisma')
const asyncHandler = require('../utils/asyncHandler')
const { startOfMonth, endOfMonth, addMonths } = require('../utils/date')

const categorySummary = asyncHandler(async (req, res) => {
  const { month, startDate, endDate, categoryId } = req.query

  const rangeStart = startDate ?? startOfMonth(month ?? new Date())
  const rangeEnd = endDate ?? endOfMonth(month ?? new Date())

  const grouped = await prisma.transaction.groupBy({
    by: ['categoryId', 'type'],
    where: {
      userId: req.user.id,
      date: { gte: rangeStart, lte: rangeEnd },
      ...(categoryId && { categoryId }),
    },
    _sum: { amount: true },
  })

  const categoryIds = grouped.map((row) => row.categoryId)
  const categories = await prisma.category.findMany({ where: { id: { in: categoryIds } } })
  const categoryById = new Map(categories.map((c) => [c.id, c]))

  const rows = grouped.map((row) => ({
    categoryId: row.categoryId,
    categoryName: categoryById.get(row.categoryId)?.name ?? 'Unknown',
    type: row.type,
    total: Number(row._sum.amount ?? 0),
  }))

  const totalIncome = rows.filter((r) => r.type === 'INCOME').reduce((sum, r) => sum + r.total, 0)
  const totalExpense = rows
    .filter((r) => r.type === 'EXPENSE')
    .reduce((sum, r) => sum + r.total, 0)

  res.json({ categories: rows, totalIncome, totalExpense })
})

const incomeVsExpense = asyncHandler(async (req, res) => {
  const monthsCount = req.query.months ?? 6
  const currentMonthStart = startOfMonth(new Date())

  const months = []
  for (let i = monthsCount - 1; i >= 0; i -= 1) {
    months.push(addMonths(currentMonthStart, -i))
  }

  const results = await Promise.all(
    months.map(async (monthStart) => {
      const monthEnd = endOfMonth(monthStart)
      const [income, expense] = await Promise.all([
        prisma.transaction.aggregate({
          where: { userId: req.user.id, type: 'INCOME', date: { gte: monthStart, lte: monthEnd } },
          _sum: { amount: true },
        }),
        prisma.transaction.aggregate({
          where: {
            userId: req.user.id,
            type: 'EXPENSE',
            date: { gte: monthStart, lte: monthEnd },
          },
          _sum: { amount: true },
        }),
      ])
      return {
        month: monthStart.toISOString().slice(0, 7),
        income: Number(income._sum.amount ?? 0),
        expense: Number(expense._sum.amount ?? 0),
      }
    }),
  )

  res.json({ months: results })
})

const dailySummary = asyncHandler(async (req, res) => {
  const monthStart = startOfMonth(req.query.month ?? new Date())
  const monthEnd = endOfMonth(monthStart)

  const transactions = await prisma.transaction.findMany({
    where: {
      userId: req.user.id,
      date: { gte: monthStart, lte: monthEnd },
      ...(req.query.categoryId && { categoryId: req.query.categoryId }),
    },
    select: { date: true, amount: true, type: true },
  })

  const byDay = new Map()
  for (const txn of transactions) {
    const key = txn.date.toISOString().slice(0, 10)
    const entry = byDay.get(key) ?? { date: key, income: 0, expense: 0 }
    entry[txn.type === 'INCOME' ? 'income' : 'expense'] += Number(txn.amount)
    byDay.set(key, entry)
  }

  const days = [...byDay.values()].sort((a, b) => a.date.localeCompare(b.date))
  res.json({ days })
})

const weeklySummary = asyncHandler(async (req, res) => {
  const monthStart = startOfMonth(req.query.month ?? new Date())
  const monthEnd = endOfMonth(monthStart)

  const transactions = await prisma.transaction.findMany({
    where: {
      userId: req.user.id,
      date: { gte: monthStart, lte: monthEnd },
      ...(req.query.categoryId && { categoryId: req.query.categoryId }),
    },
    select: { date: true, amount: true, type: true },
  })

  const byWeek = new Map()
  for (const txn of transactions) {
    const dayOfMonth = txn.date.getUTCDate()
    const week = Math.ceil(dayOfMonth / 7)
    const entry = byWeek.get(week) ?? { week, income: 0, expense: 0 }
    entry[txn.type === 'INCOME' ? 'income' : 'expense'] += Number(txn.amount)
    byWeek.set(week, entry)
  }

  const weeks = [...byWeek.values()].sort((a, b) => a.week - b.week)
  res.json({ weeks })
})

module.exports = { categorySummary, incomeVsExpense, dailySummary, weeklySummary }
