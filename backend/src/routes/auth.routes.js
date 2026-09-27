const { Router } = require('express')
const controller = require('../controllers/auth.controller')
const validate = require('../middleware/validate.middleware')
const { requireAuth } = require('../middleware/auth.middleware')
const { authLimiter } = require('../middleware/rateLimit.middleware')
const {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema,
} = require('../validators/auth.validator')

const router = Router()

router.post('/register', authLimiter, validate(registerSchema), controller.register)
router.post('/login', authLimiter, validate(loginSchema), controller.login)
router.post('/admin-login', authLimiter, validate(loginSchema), controller.adminLogin)
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), controller.forgotPassword)
router.post('/reset-password', authLimiter, validate(resetPasswordSchema), controller.resetPassword)
router.get('/me', requireAuth, controller.getMe)
router.patch('/profile', requireAuth, validate(updateProfileSchema), controller.updateProfile)

module.exports = router
