const { z } = require('zod')

const baseFields = {
  categoryId: z.number().int().positive(),
  amount: z.number().positive(),
  type: z.enum(['INCOME', 'EXPENSE']),
  description: z.string().trim().max(255).optional(),
  date: z.coerce.date(),
  isRecurringTemplate: z.boolean().optional(),
  recurrenceInterval: z.enum(['WEEKLY', 'MONTHLY']).optional(),
}

const createTransactionSchema = z
  .object(baseFields)
  .refine((data) => !data.isRecurringTemplate || data.recurrenceInterval, {
    message: 'recurrenceInterval is required when isRecurringTemplate is true',
    path: ['recurrenceInterval'],
  })

const updateTransactionSchema = z.object({
  categoryId: z.number().int().positive().optional(),
  amount: z.number().positive().optional(),
  type: z.enum(['INCOME', 'EXPENSE']).optional(),
  description: z.string().trim().max(255).optional(),
  date: z.coerce.date().optional(),
})

const listTransactionsQuerySchema = z.object({
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  categoryId: z.coerce.number().int().positive().optional(),
  type: z.enum(['INCOME', 'EXPENSE']).optional(),
})

module.exports = { createTransactionSchema, updateTransactionSchema, listTransactionsQuerySchema }
