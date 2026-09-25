const prisma = require('../config/prisma')
const { startOfMonth, endOfMonth, addMonths } = require('../utils/date')
const { getCategorySpend } = require('./spend.service')

const LOOKBACK_MONTHS = 3
const OVERSPEND_THRESHOLD = 1.2

async function upsertTip(userId, categoryId, month, kind, tipText, impactScore) {
  const existing = await prisma.savingTip.findFirst({
    where: { userId, categoryId, month, kind },
  })

  if (existing) {
    return prisma.savingTip.update({
      where: { id: existing.id },
      data: { tipText, impactScore },
    })
  }

  return prisma.savingTip.create({
    data: { userId, categoryId, month, kind, tipText, impactScore },
  })
}

async function generateAverageSpikeTips(userId, monthStart, monthEnd) {
  const activeCategories = await prisma.transaction.findMany({
    where: { userId, type: 'EXPENSE', date: { gte: monthStart, lte: monthEnd } },
    distinct: ['categoryId'],
    select: { categoryId: true },
  })

  for (const { categoryId } of activeCategories) {
    const currentTotal = await getCategorySpend(userId, categoryId, monthStart, monthEnd)
    if (currentTotal === 0) continue

    let historicalSum = 0
    for (let i = 1; i <= LOOKBACK_MONTHS; i += 1) {
      const pastMonthStart = addMonths(monthStart, -i)
      const pastMonthEnd = endOfMonth(pastMonthStart)
      historicalSum += await getCategorySpend(userId, categoryId, pastMonthStart, pastMonthEnd)
    }
    const average = historicalSum / LOOKBACK_MONTHS

    if (average > 0 && currentTotal > average * OVERSPEND_THRESHOLD) {
      const category = await prisma.category.findUnique({ where: { id: categoryId } })
      const percentUp = Math.round(((currentTotal - average) / average) * 100)
      const impact = Number((currentTotal - average).toFixed(2))
      const tipText = `Your ${category.name} spending this month ($${currentTotal.toFixed(2)}) is ${percentUp}% higher than your recent average ($${average.toFixed(2)}). Try capping it to save around $${impact.toFixed(2)}.`

      await upsertTip(userId, categoryId, monthStart, 'AVERAGE_SPIKE', tipText, impact)
    }
  }
}

async function generateBudgetExceededTips(userId, monthStart, monthEnd) {
  const budgets = await prisma.budget.findMany({
    where: { userId, month: monthStart },
    include: { category: true },
  })

  for (const budget of budgets) {
    const currentTotal = await getCategorySpend(userId, budget.categoryId, monthStart, monthEnd)
    const limit = Number(budget.limitAmount)

    if (currentTotal > limit) {
      const impact = Number((currentTotal - limit).toFixed(2))
      const tipText = `You've gone $${impact.toFixed(2)} over your $${limit.toFixed(2)} ${budget.category.name} budget this month.`

      await upsertTip(userId, budget.categoryId, monthStart, 'BUDGET_EXCEEDED', tipText, impact)
    }
  }
}

async function generateTipsForCurrentMonth(userId) {
  const monthStart = startOfMonth(new Date())
  const monthEnd = endOfMonth(monthStart)

  await generateAverageSpikeTips(userId, monthStart, monthEnd)
  await generateBudgetExceededTips(userId, monthStart, monthEnd)
}

module.exports = { generateTipsForCurrentMonth }
