const { z } = require('zod')

const categorySummaryQuerySchema = z.object({
  month: z.coerce.date().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  categoryId: z.coerce.number().int().positive().optional(),
})

const incomeVsExpenseQuerySchema = z.object({
  months: z.coerce.number().int().min(1).max(24).optional(),
})

const periodSummaryQuerySchema = z.object({
  month: z.coerce.date().optional(),
  categoryId: z.coerce.number().int().positive().optional(),
})

module.exports = {
  categorySummaryQuerySchema,
  incomeVsExpenseQuerySchema,
  periodSummaryQuerySchema,
}
