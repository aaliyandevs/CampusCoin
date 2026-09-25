const { Router } = require('express')
const controller = require('../controllers/category.controller')
const validate = require('../middleware/validate.middleware')
const { requireAuth } = require('../middleware/auth.middleware')
const { createCategorySchema, updateCategorySchema } = require('../validators/category.validator')

const router = Router()

router.use(requireAuth)

router.get('/', controller.list)
router.post('/', validate(createCategorySchema), controller.create)
router.patch('/:id', validate(updateCategorySchema), controller.update)
router.delete('/:id', controller.remove)

module.exports = router
