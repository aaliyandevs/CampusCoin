import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import {
  Plus,
  Minus,
  Wallet,
  TrendingUp,
  TrendingDown,
  Lightbulb,
  ArrowUpRight,
  ArrowDownRight,
  Megaphone,
  AlertTriangle,
  Sparkles,
  Bookmark,
  BookmarkCheck,
  Repeat,
} from 'lucide-react'
import toast from 'react-hot-toast'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Badge from '../../components/common/Badge'
import Spinner from '../../components/common/Spinner'
import TransactionFormModal from '../transactions/TransactionFormModal'
import SavingTipCard from './SavingTipCard'
import { useAuth } from '../../context/AuthContext'
import { useCurrency } from '../../context/CurrencyContext'
import { useTheme } from '../../context/ThemeContext'
import * as reportsApi from '../../api/reports.api'
import * as budgetsApi from '../../api/budgets.api'
import * as tipsApi from '../../api/tips.api'
import * as transactionsApi from '../../api/transactions.api'
import * as announcementsApi from '../../api/announcements.api'
import * as insightsApi from '../../api/insights.api'
import { cn } from '../../utils/cn'
import { getChartColors } from '../../utils/chartColors'
import { checkAndNotifyBudget } from '../../utils/budgetAlerts'
import { notifyFlags } from '../../utils/transactionFlags'

const statusTone = { OK: 'brand', NEAR: 'warning', OVER: 'danger' }
const barColor = { OK: 'bg-brand-500', NEAR: 'bg-amber-500', OVER: 'bg-rose-500' }

function currentMonth() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
}

function greetingWord() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

function DeltaBadge({ value, goodDirection = 'up' }) {
  if (value === null || value === undefined || !Number.isFinite(value)) return null
  const rounded = Math.round(value)
  if (rounded === 0) return null
  const isUp = value > 0
  const isGood = goodDirection === 'up' ? isUp : !isUp
  const Icon = isUp ? ArrowUpRight : ArrowDownRight
  return (
    <span
      className={cn(
        'inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-semibold',
        isGood
          ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300'
          : 'bg-rose-50 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
      )}
    >
      <Icon className="h-3 w-3" />
      {Math.abs(rounded)}%
    </span>
  )
}

function TrendTooltip({ active, payload, label, format }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm shadow-md dark:border-stone-700 dark:bg-stone-900">
      <p className="mb-1 font-medium text-stone-900 dark:text-stone-100">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: {format(p.value)}
        </p>
      ))}
    </div>
  )
}

function Dashboard() {
  const { user } = useAuth()
  const { format } = useCurrency()
  const { theme } = useTheme()
  const colors = getChartColors(theme)
  const firstName = user?.name?.split(' ')[0]
  const month = currentMonth()

  const [summary, setSummary] = useState(null)
  const [budgets, setBudgets] = useState(null)
  const [tips, setTips] = useState(null)
  const [trend, setTrend] = useState(null)
  const [recentTransactions, setRecentTransactions] = useState(null)
  const [announcements, setAnnouncements] = useState(null)
  const [insight, setInsight] = useState(undefined)
  const [quickAddType, setQuickAddType] = useState(null)

  const loadSummary = () => reportsApi.getCategorySummary({ month }).then(setSummary)
  const loadBudgets = () => budgetsApi.listBudgets({ month }).then(setBudgets)
  const loadTips = () => tipsApi.listTips({ limit: 5 }).then(setTips)
  const loadTrend = () => reportsApi.getIncomeVsExpense({ months: 6 }).then(setTrend)
  const loadRecent = () =>
    transactionsApi.listTransactions({}).then((list) => setRecentTransactions(list.slice(0, 5)))
  const loadAnnouncements = () => announcementsApi.listAnnouncements().then(setAnnouncements)
  const loadInsight = () => insightsApi.getCurrentInsight().then(setInsight)

  useEffect(() => {
    loadSummary()
    loadBudgets()
    loadTips()
    loadTrend()
    loadRecent()
    loadAnnouncements()
    loadInsight()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleQuickAdd = async (data) => {
    try {
      const { flags } = await transactionsApi.createTransaction(data)
      setQuickAddType(null)
      loadSummary()
      loadBudgets()
      loadTrend()
      loadRecent()
      loadInsight()
      toast.success('Transaction added')
      checkAndNotifyBudget(Number(data.categoryId), data.type)
      notifyFlags(flags)
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

  const handleToggleBookmark = async () => {
    const updated = await insightsApi.toggleInsightBookmark(insight.id)
    setInsight(updated)
  }

  const expenseCategories = (summary?.categories ?? [])
    .filter((c) => c.type === 'EXPENSE')
    .sort((a, b) => b.total - a.total)
  const topCategory = expenseCategories[0]

  const netBalance = summary ? summary.totalIncome - summary.totalExpense : 0

  const previousMonth = trend && trend.length >= 2 ? trend[trend.length - 2] : null
  const deltaOf = (current, previousValue) => {
    if (!previousValue) return null
    return ((current - previousValue) / previousValue) * 100
  }
  const incomeDelta = summary && previousMonth ? deltaOf(summary.totalIncome, previousMonth.income) : null
  const expenseDelta = summary && previousMonth ? deltaOf(summary.totalExpense, previousMonth.expense) : null
  const balanceDelta =
    summary && previousMonth
      ? deltaOf(netBalance, previousMonth.income - previousMonth.expense)
      : null

  const atRiskBudgets = (budgets ?? []).filter((b) => b.status !== 'OK')
  const hasAnyHistory = Boolean(
    (budgets && budgets.length > 0) || trend?.some((m) => m.income > 0 || m.expense > 0),
  )
  const hasTargets = Boolean(user?.monthlyAllowance || user?.monthlySavingsGoal)

  return (
    <div className="flex flex-col gap-6">
      <div className="animate-fade-up flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100">
            {greetingWord()}, {firstName}
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

      {announcements && announcements.length > 0 && (
        <Card className="animate-fade-up border-brand-200 bg-brand-50/60 dark:border-brand-900 dark:bg-brand-900/10">
          <div className="mb-2 flex items-center gap-2">
            <Megaphone className="h-4 w-4 text-brand-600 dark:text-brand-400" />
            <h2 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
              Announcements
            </h2>
          </div>
          <div className="flex flex-col divide-y divide-brand-100 dark:divide-brand-900/40">
            {announcements.slice(0, 3).map((a) => (
              <div key={a.id} className="py-2 first:pt-0 last:pb-0">
                <p className="text-sm font-medium text-stone-900 dark:text-stone-100">{a.title}</p>
                <p className="mt-0.5 text-sm text-stone-600 dark:text-stone-300">{a.body}</p>
                <p className="mt-1 text-xs text-stone-400 dark:text-stone-500">
                  {new Date(a.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {atRiskBudgets.length > 0 && (
        <div className="animate-fade-up flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-900/20">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
              {atRiskBudgets.length} budget{atRiskBudgets.length > 1 ? 's need' : ' needs'} attention
            </p>
            <p className="mt-0.5 text-sm text-amber-800/80 dark:text-amber-300/80">
              {atRiskBudgets
                .map((b) => `${b.category.name} (${b.status === 'OVER' ? 'over limit' : 'near limit'})`)
                .join(', ')}
            </p>
          </div>
          <Link
            to="/budgets"
            className="ml-auto shrink-0 text-xs font-medium text-amber-700 hover:text-amber-800 dark:text-amber-300"
          >
            Review
          </Link>
        </div>
      )}

      {summary && !hasAnyHistory && (
        <Card className="animate-fade-up border-dashed border-stone-300 bg-stone-50/50 text-center dark:border-stone-700 dark:bg-stone-900/40">
          <Sparkles className="mx-auto h-6 w-6 text-brand-500" />
          <h2 className="mt-2 font-display text-base font-semibold text-stone-900 dark:text-stone-100">
            Let's get your first transaction logged
          </h2>
          <p className="mx-auto mt-1 max-w-sm text-sm text-stone-500 dark:text-stone-400">
            Add an income or expense above and Campus Coin will start building your trends, tips,
            and budget insights.
          </p>
        </Card>
      )}

      {!summary ? (
        <div className="flex justify-center py-12">
          <Spinner className="h-6 w-6 text-stone-400" />
        </div>
      ) : (
        <div className="animate-fade-up grid grid-cols-1 gap-4 [animation-delay:60ms] sm:grid-cols-3">
          <Card className="flex items-center gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
              <TrendingUp className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm text-stone-500 dark:text-stone-400">Income</p>
                <DeltaBadge value={incomeDelta} goodDirection="up" />
              </div>
              <p className="truncate text-xl font-semibold text-stone-900 dark:text-stone-100">
                {format(summary.totalIncome)}
              </p>
            </div>
          </Card>
          <Card className="flex items-center gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
              <TrendingDown className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm text-stone-500 dark:text-stone-400">Expenses</p>
                <DeltaBadge value={expenseDelta} goodDirection="down" />
              </div>
              <p className="truncate text-xl font-semibold text-stone-900 dark:text-stone-100">
                {format(summary.totalExpense)}
              </p>
            </div>
          </Card>
          <Card className="flex items-center gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300">
              <Wallet className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm text-stone-500 dark:text-stone-400">Balance</p>
                <DeltaBadge value={balanceDelta} goodDirection="up" />
              </div>
              <p
                className={cn(
                  'truncate text-xl font-semibold',
                  netBalance >= 0
                    ? 'text-stone-900 dark:text-stone-100'
                    : 'text-rose-600 dark:text-rose-400',
                )}
              >
                {format(netBalance)}
              </p>
            </div>
          </Card>
        </div>
      )}

      <div className="animate-fade-up grid grid-cols-1 gap-4 [animation-delay:120ms] lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
              Income vs expense
            </h2>
            <Link to="/reports" className="text-xs font-medium text-brand-600 hover:text-brand-700">
              Full report
            </Link>
          </div>
          {!trend ? (
            <div className="flex justify-center py-16">
              <Spinner className="h-5 w-5 text-stone-400" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={trend}>
                <CartesianGrid vertical={false} stroke={colors.grid} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<TrendTooltip format={format} />} />
                <Bar dataKey="income" name="Income" fill={colors.income} radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" name="Expense" fill={colors.expense} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        <div className="flex flex-col gap-4">
          <Card>
            <h2 className="mb-3 text-sm font-semibold text-stone-900 dark:text-stone-100">
              Spending breakdown
            </h2>
            {expenseCategories.length === 0 ? (
              <p className="text-sm text-stone-500 dark:text-stone-400">No spending yet.</p>
            ) : (
              <div className="flex flex-col gap-2.5">
                {expenseCategories.slice(0, 4).map((c) => {
                  const share =
                    summary.totalExpense > 0
                      ? Math.round((c.total / summary.totalExpense) * 100)
                      : 0
                  return (
                    <div key={c.categoryId}>
                      <div className="mb-1 flex items-center justify-between gap-2 text-sm">
                        <span className="truncate text-stone-700 dark:text-stone-300">
                          {c.categoryName}
                        </span>
                        <span className="shrink-0 font-medium text-stone-900 dark:text-stone-100">
                          {format(c.total)}
                        </span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-stone-100 dark:bg-stone-800">
                        <div
                          className="h-full rounded-full bg-brand-500"
                          style={{ width: `${share}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
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
                    <div className="h-2 overflow-hidden rounded-full bg-stone-100 dark:bg-stone-800">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all duration-500',
                          barColor[b.status],
                        )}
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

      <div className="animate-fade-up grid grid-cols-1 gap-4 [animation-delay:160ms] lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
              Recent transactions
            </h2>
            <Link
              to="/transactions"
              className="text-xs font-medium text-brand-600 hover:text-brand-700"
            >
              View all
            </Link>
          </div>
          {!recentTransactions ? (
            <div className="flex justify-center py-8">
              <Spinner className="h-5 w-5 text-stone-400" />
            </div>
          ) : recentTransactions.length === 0 ? (
            <p className="text-sm text-stone-500 dark:text-stone-400">No transactions yet.</p>
          ) : (
            <div className="flex flex-col divide-y divide-stone-100 dark:divide-stone-800">
              {recentTransactions.map((t) => (
                <div key={t.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 truncate text-sm font-medium text-stone-900 dark:text-stone-100">
                      {t.category.name}
                      {t.isRecurringTemplate && (
                        <Repeat className="h-3 w-3 shrink-0 text-stone-400" />
                      )}
                    </p>
                    <p className="truncate text-xs text-stone-400 dark:text-stone-500">
                      {t.date.slice(0, 10)}
                      {t.description ? ` · ${t.description}` : ''}
                    </p>
                  </div>
                  <span
                    className={cn(
                      'shrink-0 text-sm font-semibold',
                      t.type === 'INCOME'
                        ? 'text-brand-700 dark:text-brand-400'
                        : 'text-stone-900 dark:text-stone-100',
                    )}
                  >
                    {t.type === 'INCOME' ? '+' : '-'}
                    {format(t.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <h2 className="mb-3 text-sm font-semibold text-stone-900 dark:text-stone-100">
            Monthly targets
          </h2>
          {!hasTargets ? (
            <p className="text-sm text-stone-500 dark:text-stone-400">
              Set a monthly allowance or savings goal in your{' '}
              <Link to="/profile" className="font-medium text-brand-600 hover:text-brand-700">
                profile
              </Link>{' '}
              to track progress here.
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {user.monthlyAllowance != null && summary && (
                <div>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-stone-600 dark:text-stone-300">Income vs allowance</span>
                    <span className="font-medium text-stone-900 dark:text-stone-100">
                      {format(summary.totalIncome)} / {format(user.monthlyAllowance)}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-stone-100 dark:bg-stone-800">
                    <div
                      className="h-full rounded-full bg-brand-500 transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          (summary.totalIncome / Number(user.monthlyAllowance)) * 100,
                          100,
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              )}
              {user.monthlySavingsGoal != null && summary && (
                <div>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-stone-600 dark:text-stone-300">Savings goal</span>
                    <span className="font-medium text-stone-900 dark:text-stone-100">
                      {format(netBalance)} / {format(user.monthlySavingsGoal)}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-stone-100 dark:bg-stone-800">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all duration-500',
                        netBalance >= Number(user.monthlySavingsGoal)
                          ? 'bg-brand-500'
                          : 'bg-amber-500',
                      )}
                      style={{
                        width: `${Math.min(
                          Math.max((netBalance / Number(user.monthlySavingsGoal)) * 100, 0),
                          100,
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>

      <Card className="animate-fade-up [animation-delay:200ms]">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-brand-500" />
            <h2 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
              This month's insight
            </h2>
          </div>
          {insight && (
            <button
              onClick={handleToggleBookmark}
              aria-label={insight.isBookmarked ? 'Remove bookmark' : 'Bookmark insight'}
              className="text-stone-400 hover:text-brand-600 dark:hover:text-brand-400"
            >
              {insight.isBookmarked ? (
                <BookmarkCheck className="h-4 w-4 text-brand-600 dark:text-brand-400" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
        {insight === undefined ? (
          <div className="flex justify-center py-6">
            <Spinner className="h-5 w-5 text-stone-400" />
          </div>
        ) : !insight ? (
          <p className="text-sm text-stone-500 dark:text-stone-400">
            Log a few transactions this month and we'll summarize your spending here.
          </p>
        ) : (
          <div>
            <p className="text-sm leading-relaxed text-stone-700 dark:text-stone-300">
              {insight.summaryText}
            </p>
            {insight.tipText && (
              <p className="mt-2 text-sm font-medium text-brand-700 dark:text-brand-400">
                {insight.tipText}
              </p>
            )}
          </div>
        )}
      </Card>

      <Card className="animate-fade-up [animation-delay:240ms]">
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
          <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
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
