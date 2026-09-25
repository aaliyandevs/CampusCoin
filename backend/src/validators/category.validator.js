const { z } = require('zod')

const createCategorySchema = z.object({
  name: z.string().trim().min(1).max(100),
  type: z.enum(['INCOME', 'EXPENSE']),
})

const updateCategorySchema = z.object({
  name: z.string().trim().min(1).max(100),
})

module.exports = { createCategorySchema, updateCategorySchema }
