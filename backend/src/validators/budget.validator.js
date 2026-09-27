const { z } = require('zod')

const MAX_AMOUNT = 10_000_000

const setBudgetSchema = z.object({
  categoryId: z.number().int().positive(),
  month: z.coerce.date(),
  limitAmount: z.number().positive().max(MAX_AMOUNT),
})

const updateBudgetSchema = z.object({
  limitAmount: z.number().positive().max(MAX_AMOUNT),
})

const listBudgetsQuerySchema = z.object({
  month: z.coerce.date().optional(),
})

module.exports = { setBudgetSchema, updateBudgetSchema, listBudgetsQuerySchema }
