const prisma = require('../config/prisma')
const asyncHandler = require('../utils/asyncHandler')

const list = asyncHandler(async (req, res) => {
  const categories = await prisma.category.findMany({
    where: { isDefault: true },
    orderBy: [{ type: 'asc' }, { name: 'asc' }],
  })
  res.json({ categories })
})

const create = asyncHandler(async (req, res) => {
  const { name, type } = req.body

  const existing = await prisma.category.findFirst({ where: { userId: null, name, type } })
  if (existing) {
    return res.status(409).json({ message: 'A default category with this name already exists' })
  }

  const category = await prisma.category.create({
    data: { name, type, isDefault: true, userId: null },
  })
  res.status(201).json({ category })
})

const update = asyncHandler(async (req, res) => {
  const categoryId = Number(req.params.id)

  const category = await prisma.category.findUnique({ where: { id: categoryId } })
  if (!category || !category.isDefault) {
    return res.status(404).json({ message: 'Default category not found' })
  }

  const updated = await prisma.category.update({
    where: { id: categoryId },
    data: { name: req.body.name },
  })
  res.json({ category: updated })
})

const remove = asyncHandler(async (req, res) => {
  const categoryId = Number(req.params.id)

  const category = await prisma.category.findUnique({ where: { id: categoryId } })
  if (!category || !category.isDefault) {
    return res.status(404).json({ message: 'Default category not found' })
  }

  const [transactionCount, budgetCount] = await Promise.all([
    prisma.transaction.count({ where: { categoryId } }),
    prisma.budget.count({ where: { categoryId } }),
  ])

  if (transactionCount > 0 || budgetCount > 0) {
    return res.status(409).json({
      message: 'Cannot delete a default category that is already in use by students',
    })
  }

  await prisma.category.delete({ where: { id: categoryId } })
  res.status(204).send()
})

module.exports = { list, create, update, remove }
