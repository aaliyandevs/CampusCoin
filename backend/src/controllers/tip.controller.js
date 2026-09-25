const prisma = require('../config/prisma')
const asyncHandler = require('../utils/asyncHandler')
const { generateTipsForCurrentMonth } = require('../services/savingTips.service')

const list = asyncHandler(async (req, res) => {
  await generateTipsForCurrentMonth(req.user.id)

  const tips = await prisma.savingTip.findMany({
    where: { userId: req.user.id, isDismissed: false },
    include: { category: true },
    orderBy: [{ isPinned: 'desc' }, { impactScore: 'desc' }],
    take: req.query.limit ? Number(req.query.limit) : undefined,
  })

  res.json({ tips })
})

const pin = asyncHandler(async (req, res) => {
  const tipId = Number(req.params.id)

  const tip = await prisma.savingTip.findUnique({ where: { id: tipId } })
  if (!tip || tip.userId !== req.user.id) {
    return res.status(404).json({ message: 'Tip not found' })
  }

  const updated = await prisma.savingTip.update({
    where: { id: tipId },
    data: { isPinned: !tip.isPinned },
  })
  res.json({ tip: updated })
})

const dismiss = asyncHandler(async (req, res) => {
  const tipId = Number(req.params.id)

  const tip = await prisma.savingTip.findUnique({ where: { id: tipId } })
  if (!tip || tip.userId !== req.user.id) {
    return res.status(404).json({ message: 'Tip not found' })
  }

  const updated = await prisma.savingTip.update({
    where: { id: tipId },
    data: { isDismissed: true },
  })
  res.json({ tip: updated })
})

module.exports = { list, pin, dismiss }
