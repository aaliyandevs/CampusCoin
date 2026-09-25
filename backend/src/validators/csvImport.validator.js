const { z } = require('zod')

const csvRowSchema = z.object({
  date: z.coerce.date(),
  type: z.preprocess(
    (val) => (typeof val === 'string' ? val.trim().toUpperCase() : val),
    z.enum(['INCOME', 'EXPENSE']),
  ),
  category: z.string().trim().min(1).max(100),
  amount: z.coerce.number().positive(),
  description: z.string().trim().max(255).optional(),
})

module.exports = { csvRowSchema }
