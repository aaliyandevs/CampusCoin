const { Router } = require('express')
const controller = require('../controllers/insight.controller')
const { requireAuth } = require('../middleware/auth.middleware')
const { validateIdParam } = require('../middleware/validate.middleware')

const router = Router()

router.use(requireAuth)

router.get('/current', controller.current)
router.patch('/:id/bookmark', validateIdParam(), controller.bookmark)

module.exports = router
