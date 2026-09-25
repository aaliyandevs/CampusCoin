import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Minus, Wallet, TrendingUp, TrendingDown, Lightbulb } from 'lucide-react'
import toast from 'react-hot-toast'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Badge from '../../components/common/Badge'
import Spinner from '../../components/common/Spinner'
import TransactionFormModal from '../transactions/TransactionFormModal'
import SavingTipCard from './SavingTipCard'
import { useAuth } from '../../context/AuthContext'
import * as reportsApi from '../../api/reports.api'
import * as budgetsApi from '../../api/budgets.api'
import * as tipsApi from '../../api/tips.api'
import * as transactionsApi from '../../api/transactions.api'
import { formatCurrency } from '../../utils/format'
import { cn } from '../../utils/cn'
import { checkAndNotifyBudget } from '../../utils/budgetAlerts'

const statusTone = { OK: 'brand', NEAR: 'warning', OVER: 'danger' }
const barColor = { OK: 'bg-brand-500', NEAR: 'bg-amber-500', OVER: 'bg-rose-500' }

function currentMonth() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
}

function Dashboard() {
  const { user } = useAuth()
  const firstName = user?.name?.split(' ')[0]
  const month = currentMonth()

  const [summary, setSummary] = useState(null)
  const [budgets, setBudgets] = useState(null)
  const [tips, setTips] = useState(null)
  const [quickAddType, setQuickAddType] = useState(null)

  const loadSummary = () => reportsApi.getCategorySummary({ month }).then(setSummary)
  const loadBudgets = () => budgetsApi.listBudgets({ month }).then(setBudgets)
  const loadTips = () => tipsApi.listTips({ limit: 5 }).then(setTips)

  useEffect(() => {
    loadSummary()
    loadBudgets()
    loadTips()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleQuickAdd = async (data) => {
    try {
      await transactionsApi.createTransaction(data)
      setQuickAddType(null)
      loadSummary()
      loadBudgets()
      toast.success('Transaction added')
      checkAndNotifyBudget(Number(data.categoryId), data.type)
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Something went wrong')
    }
  }

  const handlePinTip = async (tip) => {
    await tipsApi.pinTip(tip.id)
    loadTips()
  }

  const handleDismissTip = async (tip) => {
    await tipsApi.dismissTip(tip.id)
    loadTips()
  }

  const topCategory = summary?.categories
    .filter((c) => c.type === 'EXPENSE')
    .sort((a, b) => b.total - a.total)[0]

  const netBalance = summary ? summary.totalIncome - summary.totalExpense : 0

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100">
            Welcome back, {firstName}
          </h1>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
            Here's how this month is looking.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setQuickAddType('INCOME')}>
            <Plus className="h-4 w-4" />
            Income
          </Button>
          <Button variant="secondary" onClick={() => setQuickAddType('EXPENSE')}>
            <Minus className="h-4 w-4" />
            Expense
          </Button>
        </div>
      </div>

      {!summary ? (
        <div className="flex justify-center py-12">
          <Spinner className="h-6 w-6 text-stone-400" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="flex items-center gap-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
              <TrendingUp className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm text-stone-500 dark:text-stone-400">Income</p>
              <p className="text-xl font-semibold text-stone-900 dark:text-stone-100">
                {formatCurrency(summary.totalIncome)}
              </p>
            </div>
          </Card>
          <Card className="flex items-center gap-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
              <TrendingDown className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm text-stone-500 dark:text-stone-400">Expenses</p>
              <p className="text-xl font-semibold text-stone-900 dark:text-stone-100">
                {formatCurrency(summary.totalExpense)}
              </p>
            </div>
          </Card>
          <Card className="flex items-center gap-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300">
              <Wallet className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm text-stone-500 dark:text-stone-400">Balance</p>
              <p
                className={cn(
                  'text-xl font-semibold',
                  netBalance >= 0
                    ? 'text-stone-900 dark:text-stone-100'
                    : 'text-rose-600 dark:text-rose-400',
                )}
              >
                {formatCurrency(netBalance)}
              </p>
            </div>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-3 flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-amber-500" />
            <h2 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
              Saving tips
            </h2>
          </div>
          {!tips ? (
            <div className="flex justify-center py-8">
              <Spinner className="h-5 w-5 text-stone-400" />
            </div>
          ) : tips.length === 0 ? (
            <p className="text-sm text-stone-500 dark:text-stone-400">
              No tips yet — keep logging transactions and we'll spot patterns as they emerge.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {tips.map((tip) => (
                <SavingTipCard
                  key={tip.id}
                  tip={tip}
                  onPin={handlePinTip}
                  onDismiss={handleDismissTip}
                />
              ))}
            </div>
          )}
        </Card>

        <div className="flex flex-col gap-4">
          <Card>
            <h2 className="mb-2 text-sm font-semibold text-stone-900 dark:text-stone-100">
              This month's top category
            </h2>
            {topCategory ? (
              <div>
                <p className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                  {topCategory.categoryName}
                </p>
                <p className="text-sm text-stone-500 dark:text-stone-400">
                  {formatCurrency(topCategory.total)} spent
                </p>
              </div>
            ) : (
              <p className="text-sm text-stone-500 dark:text-stone-400">No spending yet.</p>
            )}
          </Card>

          <Card>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                Budget vs actual
              </h2>
              <Link
                to="/budgets"
                className="text-xs font-medium text-brand-600 hover:text-brand-700"
              >
                View all
              </Link>
            </div>
            {!budgets ? (
              <div className="flex justify-center py-4">
                <Spinner className="h-5 w-5 text-stone-400" />
              </div>
            ) : budgets.length === 0 ? (
              <p className="text-sm text-stone-500 dark:text-stone-400">No budgets set.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {budgets.slice(0, 3).map((b) => (
                  <div key={b.id}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="text-stone-700 dark:text-stone-300">
                        {b.category.name}
                      </span>
                      <Badge tone={statusTone[b.status]}>{b.percentUsed}%</Badge>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-stone-100 dark:bg-stone-800">
                      <div
                        className={cn('h-full rounded-full', barColor[b.status])}
                        style={{ width: `${Math.min(b.percentUsed, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      <TransactionFormModal
        open={Boolean(quickAddType)}
        defaultType={quickAddType ?? 'EXPENSE'}
        onClose={() => setQuickAddType(null)}
        onSubmit={handleQuickAdd}
      />
    </div>
  )
}

export default Dashboard
