const prisma = require('../config/prisma')

const DUPLICATE_WINDOW_DAYS = 1
const UNUSUAL_MULTIPLIER = 3
const MIN_HISTORY_FOR_UNUSUAL = 3

async function detectFlags(userId, { categoryId, amount, type, date }) {
  const flags = []
  const targetDate = new Date(date)

  const windowStart = new Date(targetDate)
  windowStart.setDate(windowStart.getDate() - DUPLICATE_WINDOW_DAYS)
  const windowEnd = new Date(targetDate)
  windowEnd.setDate(windowEnd.getDate() + DUPLICATE_WINDOW_DAYS)

  const possibleDuplicate = await prisma.transaction.findFirst({
    where: {
      userId,
      categoryId,
      type,
      amount,
      date: { gte: windowStart, lte: windowEnd },
    },
  })
  if (possibleDuplicate) {
    flags.push('This looks like a duplicate of a transaction within a day of this one.')
  }

  if (type === 'EXPENSE') {
    const stats = await prisma.transaction.aggregate({
      where: { userId, categoryId, type: 'EXPENSE' },
      _avg: { amount: true },
      _count: true,
    })
    const average = Number(stats._avg.amount ?? 0)
    if (
      stats._count >= MIN_HISTORY_FOR_UNUSUAL &&
      average > 0 &&
      Number(amount) > average * UNUSUAL_MULTIPLIER
    ) {
      const multiple = (Number(amount) / average).toFixed(1)
      flags.push(`This is unusually large for this category — about ${multiple}x your typical amount.`)
    }
  }

  return flags
}

module.exports = { detectFlags }
