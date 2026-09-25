const { z } = require('zod')

const registerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8).max(72),
})

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
})

const forgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
})

const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8).max(72),
})

const updateProfileSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  academicYear: z.string().trim().max(50).nullable().optional(),
  monthlyAllowance: z.number().nonnegative().nullable().optional(),
  monthlySavingsGoal: z.number().nonnegative().nullable().optional(),
})

module.exports = {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema,
}
