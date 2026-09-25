const { Router } = require('express')
const controller = require('../controllers/budget.controller')
const validate = require('../middleware/validate.middleware')
const { validateQuery } = require('../middleware/validate.middleware')
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
router.patch('/:id', validate(updateBudgetSchema), controller.update)
router.delete('/:id', controller.remove)

module.exports = router
