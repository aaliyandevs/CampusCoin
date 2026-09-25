const prisma = require('../config/prisma')
const asyncHandler = require('../utils/asyncHandler')

const list = asyncHandler(async (req, res) => {
  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: 'desc' },
  })
  res.json({ announcements })
})

const create = asyncHandler(async (req, res) => {
  const announcement = await prisma.announcement.create({
    data: { ...req.body, createdBy: req.user.id },
  })
  res.status(201).json({ announcement })
})

const update = asyncHandler(async (req, res) => {
  const announcementId = Number(req.params.id)

  const existing = await prisma.announcement.findUnique({ where: { id: announcementId } })
  if (!existing) {
    return res.status(404).json({ message: 'Announcement not found' })
  }

  const announcement = await prisma.announcement.update({
    where: { id: announcementId },
    data: req.body,
  })
  res.json({ announcement })
})

const remove = asyncHandler(async (req, res) => {
  const announcementId = Number(req.params.id)

  const existing = await prisma.announcement.findUnique({ where: { id: announcementId } })
  if (!existing) {
    return res.status(404).json({ message: 'Announcement not found' })
  }

  await prisma.announcement.delete({ where: { id: announcementId } })
  res.status(204).send()
})

module.exports = { list, create, update, remove }
