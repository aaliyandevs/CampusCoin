const { Router } = require('express')
const controller = require('../controllers/tip.controller')
const { requireAuth } = require('../middleware/auth.middleware')

const router = Router()

router.use(requireAuth)

router.get('/', controller.list)
router.patch('/:id/pin', controller.pin)
router.patch('/:id/dismiss', controller.dismiss)

module.exports = router
