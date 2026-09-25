const prisma = require('../config/prisma')

async function getCategorySpend(userId, categoryId, monthStart, monthEnd) {
  const result = await prisma.transaction.aggregate({
    where: {
      userId,
      categoryId,
      type: 'EXPENSE',
      date: { gte: monthStart, lte: monthEnd },
    },
    _sum: { amount: true },
  })
  return Number(result._sum.amount ?? 0)
}

module.exports = { getCategorySpend }
