import toast from 'react-hot-toast'
import * as budgetsApi from '../api/budgets.api'
import { formatCurrency } from './format'

function currentMonth() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
}

export async function checkAndNotifyBudget(categoryId, type) {
  if (type !== 'EXPENSE') return

  const budgets = await budgetsApi.listBudgets({ month: currentMonth() })
  const budget = budgets.find((b) => b.categoryId === categoryId)
  if (!budget || budget.status === 'OK') return

  if (budget.status === 'OVER') {
    toast.error(
      `Over budget: ${budget.category.name} — ${formatCurrency(budget.spent)} of ${formatCurrency(budget.limitAmount)}`,
    )
  } else if (budget.status === 'NEAR') {
    toast(`Nearing budget: ${budget.category.name} (${budget.percentUsed}% used)`, { icon: '⚠️' })
  }
}
