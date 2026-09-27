const { Router } = require('express')
const controller = require('../controllers/tip.controller')
const { requireAuth } = require('../middleware/auth.middleware')
const { validateIdParam } = require('../middleware/validate.middleware')

const router = Router()

router.use(requireAuth)

router.get('/', controller.list)
router.patch('/:id/pin', validateIdParam(), controller.pin)
router.patch('/:id/dismiss', validateIdParam(), controller.dismiss)

module.exports = router
