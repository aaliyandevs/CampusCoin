const prisma = require('../config/prisma')
const { startOfMonth, endOfMonth, addMonths } = require('../utils/date')
const { getCategorySpend } = require('./spend.service')

async function buildNarrative(userId, monthStart, monthEnd) {
  const [incomeAgg, expenseAgg, categoryTotals, budgets] = await Promise.all([
    prisma.transaction.aggregate({
      where: { userId, type: 'INCOME', date: { gte: monthStart, lte: monthEnd } },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: { userId, type: 'EXPENSE', date: { gte: monthStart, lte: monthEnd } },
      _sum: { amount: true },
    }),
    prisma.transaction.groupBy({
      by: ['categoryId'],
      where: { userId, type: 'EXPENSE', date: { gte: monthStart, lte: monthEnd } },
      _sum: { amount: true },
    }),
    prisma.budget.findMany({ where: { userId, month: monthStart }, include: { category: true } }),
  ])

  const totalIncome = Number(incomeAgg._sum.amount ?? 0)
  const totalExpense = Number(expenseAgg._sum.amount ?? 0)

  if (totalIncome === 0 && totalExpense === 0) {
    return null
  }

  const prevMonthStart = addMonths(monthStart, -1)
  const prevMonthEnd = endOfMonth(prevMonthStart)
  const prevExpenseAgg = await prisma.transaction.aggregate({
    where: { userId, type: 'EXPENSE', date: { gte: prevMonthStart, lte: prevMonthEnd } },
    _sum: { amount: true },
  })
  const prevExpense = Number(prevExpenseAgg._sum.amount ?? 0)

  let topCategoryId = null
  let topAmount = 0
  for (const row of categoryTotals) {
    const amount = Number(row._sum.amount ?? 0)
    if (amount > topAmount) {
      topAmount = amount
      topCategoryId = row.categoryId
    }
  }

  const sentences = [
    `You logged $${totalExpense.toFixed(2)} in expenses and $${totalIncome.toFixed(2)} in income this month.`,
  ]

  if (prevExpense > 0) {
    const changePercent = Math.round(((totalExpense - prevExpense) / prevExpense) * 100)
    if (changePercent > 5) {
      sentences.push(`That's ${changePercent}% more than you spent last month.`)
    } else if (changePercent < -5) {
      sentences.push(`That's ${Math.abs(changePercent)}% less than last month — nice work.`)
    } else {
      sentences.push('Your spending is holding steady compared to last month.')
    }
  }

  if (topCategoryId && totalExpense > 0) {
    const category = await prisma.category.findUnique({ where: { id: topCategoryId } })
    const share = Math.round((topAmount / totalExpense) * 100)
    if (category) {
      sentences.push(
        `${category.name} was your biggest category at $${topAmount.toFixed(2)} (${share}% of spending).`,
      )
    }
  }

  let tipText = null
  const overBudget = []
  const nearBudget = []
  for (const budget of budgets) {
    const spent = await getCategorySpend(userId, budget.categoryId, monthStart, monthEnd)
    const limit = Number(budget.limitAmount)
    const percentUsed = limit > 0 ? (spent / limit) * 100 : 0
    if (spent > limit) {
      overBudget.push(`${budget.category.name} is over by $${(spent - limit).toFixed(2)}`)
    } else if (percentUsed >= 80) {
      nearBudget.push(budget.category.name)
    }
  }

  if (overBudget.length > 0) {
    tipText = `Heads up: ${overBudget.join('; ')}.`
  } else if (nearBudget.length > 0) {
    tipText = `Watch these — nearing their limit: ${nearBudget.join(', ')}.`
  } else if (budgets.length > 0) {
    tipText = 'All of your budgets are comfortably within limit this month.'
  }

  return { summaryText: sentences.join(' '), tipText }
}

async function generateInsightForCurrentMonth(userId) {
  const monthStart = startOfMonth(new Date())
  const monthEnd = endOfMonth(monthStart)
  const narrative = await buildNarrative(userId, monthStart, monthEnd)

  if (!narrative) {
    return null
  }

  return prisma.insight.upsert({
    where: { userId_month: { userId, month: monthStart } },
    update: { summaryText: narrative.summaryText, tipText: narrative.tipText },
    create: {
      userId,
      month: monthStart,
      summaryText: narrative.summaryText,
      tipText: narrative.tipText,
    },
  })
}

module.exports = { generateInsightForCurrentMonth }
