const { Router } = require('express')
const controller = require('../controllers/budget.controller')
const validate = require('../middleware/validate.middleware')
const { validateQuery, validateIdParam } = require('../middleware/validate.middleware')
const { requireAuth } = require('../middleware/auth.middleware')
const {
  setBudgetSchema,
  updateBudgetSchema,
  listBudgetsQuerySchema,
} = require('../validators/budget.validator')

const router = Router()

router.use(requireAuth)

router.get('/', validateQuery(listBudgetsQuerySchema), controller.list)
router.post('/', validate(setBudgetSchema), controller.setBudget)
router.patch('/:id', validateIdParam(), validate(updateBudgetSchema), controller.update)
router.delete('/:id', validateIdParam(), controller.remove)

module.exports = router
