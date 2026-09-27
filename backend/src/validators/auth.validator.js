const { z } = require('zod')

const passwordSchema = z
  .string()
  .min(8)
  .max(72)
  .regex(/[a-zA-Z]/, 'Password must contain at least one letter')
  .regex(/[0-9]/, 'Password must contain at least one number')

const registerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().toLowerCase().email(),
  password: passwordSchema,
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
  password: passwordSchema,
})

const updateProfileSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  academicYear: z.string().trim().max(50).nullable().optional(),
  monthlyAllowance: z.number().nonnegative().max(10_000_000).nullable().optional(),
  monthlySavingsGoal: z.number().nonnegative().max(10_000_000).nullable().optional(),
})

module.exports = {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema,
}
