const { Router } = require('express')
const controller = require('../controllers/transaction.controller')
const validate = require('../middleware/validate.middleware')
const { validateQuery } = require('../middleware/validate.middleware')
const { requireAuth } = require('../middleware/auth.middleware')
const {
  createTransactionSchema,
  updateTransactionSchema,
  listTransactionsQuerySchema,
} = require('../validators/transaction.validator')

const router = Router()

router.use(requireAuth)

router.get('/', validateQuery(listTransactionsQuerySchema), controller.list)
router.post('/', validate(createTransactionSchema), controller.create)
router.patch('/:id', validate(updateTransactionSchema), controller.update)
router.delete('/:id', controller.remove)

module.exports = router
