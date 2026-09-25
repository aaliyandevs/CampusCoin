const { z } = require('zod')

const setBudgetSchema = z.object({
  categoryId: z.number().int().positive(),
  month: z.coerce.date(),
  limitAmount: z.number().positive(),
})

const updateBudgetSchema = z.object({
  limitAmount: z.number().positive(),
})

const listBudgetsQuerySchema = z.object({
  month: z.coerce.date().optional(),
})

module.exports = { setBudgetSchema, updateBudgetSchema, listBudgetsQuerySchema }
