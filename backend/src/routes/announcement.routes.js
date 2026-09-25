const { Router } = require('express')
const controller = require('../controllers/announcement.controller')
const validate = require('../middleware/validate.middleware')
const { requireAuth, requireAdmin } = require('../middleware/auth.middleware')
const {
  createAnnouncementSchema,
  updateAnnouncementSchema,
} = require('../validators/announcement.validator')

const router = Router()

router.use(requireAuth)

router.get('/', controller.list)
router.post('/', requireAdmin, validate(createAnnouncementSchema), controller.create)
router.patch('/:id', requireAdmin, validate(updateAnnouncementSchema), controller.update)
router.delete('/:id', requireAdmin, controller.remove)

module.exports = router
