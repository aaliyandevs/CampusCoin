import { useEffect, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Badge from '../../components/common/Badge'
import Spinner from '../../components/common/Spinner'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import BudgetFormModal from './BudgetFormModal'
import * as budgetsApi from '../../api/budgets.api'
import { formatCurrency } from '../../utils/format'
import { cn } from '../../utils/cn'

const statusTone = { OK: 'brand', NEAR: 'warning', OVER: 'danger' }
const barColor = { OK: 'bg-brand-500', NEAR: 'bg-amber-500', OVER: 'bg-rose-500' }

function currentMonth() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
}

function Budgets() {
  const [budgets, setBudgets] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [deletingBudget, setDeletingBudget] = useState(null)
  const month = currentMonth()

  const load = () => budgetsApi.listBudgets({ month }).then(setBudgets)

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubmit = async (data) => {
    try {
      await budgetsApi.setBudget(data)
      setFormOpen(false)
      load()
      toast.success('Budget saved')
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Something went wrong')
    }
  }

  const handleDelete = async () => {
    try {
      await budgetsApi.deleteBudget(deletingBudget.id)
      setDeletingBudget(null)
      load()
      toast.success('Budget removed')
    } catch (err) {
      setDeletingBudget(null)
      toast.error(err.response?.data?.message ?? 'Could not remove budget')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100">Budgets</h1>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="h-4 w-4" />
          Set budget
        </Button>
      </div>

      {!budgets ? (
        <div className="flex justify-center py-12">
          <Spinner className="h-6 w-6 text-stone-400" />
        </div>
      ) : budgets.length === 0 ? (
        <Card>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            No budgets set for this month yet.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {budgets.map((b) => (
            <Card key={b.id}>
              <div className="mb-2 flex items-start justify-between">
                <div>
                  <p className="font-medium text-stone-900 dark:text-stone-100">
                    {b.category.name}
                  </p>
                  <p className="text-sm text-stone-500 dark:text-stone-400">
                    {formatCurrency(b.spent)} of {formatCurrency(b.limitAmount)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone={statusTone[b.status]}>{b.status}</Badge>
                  <button
                    onClick={() => setDeletingBudget(b)}
                    aria-label="Remove budget"
                    className="rounded-md p-1.5 text-stone-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/30"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-stone-100 dark:bg-stone-800">
                <div
                  className={cn('h-full rounded-full', barColor[b.status])}
                  style={{ width: `${Math.min(b.percentUsed, 100)}%` }}
                />
              </div>
              <p className="mt-1.5 text-xs text-stone-400 dark:text-stone-500">
                {b.percentUsed}% used
              </p>
            </Card>
          ))}
        </div>
      )}

      <BudgetFormModal
        open={formOpen}
        month={month}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={Boolean(deletingBudget)}
        title="Remove budget"
        message={`Remove the budget for "${deletingBudget?.category.name}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeletingBudget(null)}
      />
    </div>
  )
}

export default Budgets
