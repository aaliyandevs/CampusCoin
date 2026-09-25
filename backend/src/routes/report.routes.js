const { Router } = require('express')
const controller = require('../controllers/report.controller')
const { validateQuery } = require('../middleware/validate.middleware')
const { requireAuth } = require('../middleware/auth.middleware')
const {
  categorySummaryQuerySchema,
  incomeVsExpenseQuerySchema,
  periodSummaryQuerySchema,
} = require('../validators/report.validator')

const router = Router()

router.use(requireAuth)

router.get('/category-summary', validateQuery(categorySummaryQuerySchema), controller.categorySummary)
router.get('/income-vs-expense', validateQuery(incomeVsExpenseQuerySchema), controller.incomeVsExpense)
router.get('/daily-summary', validateQuery(periodSummaryQuerySchema), controller.dailySummary)
router.get('/weekly-summary', validateQuery(periodSummaryQuerySchema), controller.weeklySummary)

module.exports = router
