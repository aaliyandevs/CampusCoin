const { Router } = require('express')
const adminController = require('../controllers/admin.controller')
const adminCategoryController = require('../controllers/adminCategory.controller')
const validate = require('../middleware/validate.middleware')
const { validateIdParam } = require('../middleware/validate.middleware')
const { requireAuth, requireAdmin } = require('../middleware/auth.middleware')
const { createCategorySchema, updateCategorySchema } = require('../validators/category.validator')

const router = Router()

router.use(requireAuth, requireAdmin)

router.get('/users', adminController.listUsers)
router.patch('/users/:id/disable', validateIdParam(), adminController.toggleDisableUser)
router.post('/users/:id/reset-password', validateIdParam(), adminController.resetUserPassword)

router.get('/stats', adminController.stats)

router.get('/categories', adminCategoryController.list)
router.post('/categories', validate(createCategorySchema), adminCategoryController.create)
router.patch(
  '/categories/:id',
  validateIdParam(),
  validate(updateCategorySchema),
  adminCategoryController.update,
)
router.delete('/categories/:id', validateIdParam(), adminCategoryController.remove)

module.exports = router
