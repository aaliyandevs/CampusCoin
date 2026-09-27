const prisma = require('../config/prisma')
const asyncHandler = require('../utils/asyncHandler')
const { generateInsightForCurrentMonth } = require('../services/insight.service')

const current = asyncHandler(async (req, res) => {
  const insight = await generateInsightForCurrentMonth(req.user.id)
  res.json({ insight })
})

const bookmark = asyncHandler(async (req, res) => {
  const insightId = Number(req.params.id)

  const insight = await prisma.insight.findUnique({ where: { id: insightId } })
  if (!insight || insight.userId !== req.user.id) {
    return res.status(404).json({ message: 'Insight not found' })
  }

  const updated = await prisma.insight.update({
    where: { id: insightId },
    data: { isBookmarked: !insight.isBookmarked },
  })
  res.json({ insight: updated })
})

module.exports = { current, bookmark }
