import { useEffect, useRef, useState } from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts'
import { Download } from 'lucide-react'
import html2canvas from 'html2canvas-pro'
import jsPDF from 'jspdf'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Spinner from '../../components/common/Spinner'
import { useTheme } from '../../context/ThemeContext'
import * as reportsApi from '../../api/reports.api'
import { formatCurrency } from '../../utils/format'
import { getChartColors } from '../../utils/chartColors'

function currentMonthInput() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm shadow-md dark:border-stone-700 dark:bg-stone-900">
      <p className="mb-1 font-medium text-stone-900 dark:text-stone-100">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: {formatCurrency(p.value)}
        </p>
      ))}
    </div>
  )
}

function Reports() {
  const { theme } = useTheme()
  const colors = getChartColors(theme)
  const reportRef = useRef(null)

  const [month, setMonth] = useState(currentMonthInput())
  const [period, setPeriod] = useState('daily')
  const [categorySummary, setCategorySummary] = useState(null)
  const [trend, setTrend] = useState(null)
  const [periodData, setPeriodData] = useState(null)

  useEffect(() => {
    const monthDate = `${month}-01`
    reportsApi.getCategorySummary({ month: monthDate }).then(setCategorySummary)
    reportsApi.getIncomeVsExpense({ months: 6 }).then(setTrend)
    if (period === 'daily') {
      reportsApi.getDailySummary({ month: monthDate }).then(setPeriodData)
    } else {
      reportsApi.getWeeklySummary({ month: monthDate }).then((weeks) =>
        setPeriodData(weeks.map((w) => ({ ...w, label: `Week ${w.week}` }))),
      )
    }
  }, [month, period])

  const expenseByCategory = (categorySummary?.categories ?? [])
    .filter((c) => c.type === 'EXPENSE')
    .sort((a, b) => b.total - a.total)

  const handleExport = async () => {
    const canvas = await html2canvas(reportRef.current, { backgroundColor: null })
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [canvas.width, canvas.height] })
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height)
    pdf.save(`campus-coin-report-${month}.pdf`)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100">Reports</h1>
        <div className="flex items-center gap-3">
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="h-10 rounded-lg border border-stone-300 bg-white px-3 text-sm text-stone-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
          />
          <Button variant="secondary" onClick={handleExport}>
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      <div ref={reportRef} className="flex flex-col gap-6 bg-stone-50 dark:bg-stone-950">
        <Card>
          <h2 className="mb-4 text-sm font-semibold text-stone-900 dark:text-stone-100">
            Spending by category
          </h2>
          {!categorySummary ? (
            <div className="flex justify-center py-12">
              <Spinner className="h-6 w-6 text-stone-400" />
            </div>
          ) : expenseByCategory.length === 0 ? (
            <p className="text-sm text-stone-500 dark:text-stone-400">No expenses this month.</p>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={Math.max(expenseByCategory.length * 40, 120)}>
                <BarChart data={expenseByCategory} layout="vertical" margin={{ left: 12 }}>
                  <CartesianGrid horizontal={false} stroke={colors.grid} />
                  <XAxis type="number" tickFormatter={formatCurrency} tick={{ fontSize: 12 }} />
                  <YAxis
                    type="category"
                    dataKey="categoryName"
                    width={100}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="total" name="Spent" fill={colors.single} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <ul className="mt-4 flex flex-col divide-y divide-stone-100 dark:divide-stone-800">
                {expenseByCategory.map((c) => (
                  <li key={c.categoryId} className="flex justify-between py-2 text-sm">
                    <span className="text-stone-600 dark:text-stone-300">{c.categoryName}</span>
                    <span className="font-medium text-stone-900 dark:text-stone-100">
                      {formatCurrency(c.total)}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Card>

        <Card>
          <h2 className="mb-4 text-sm font-semibold text-stone-900 dark:text-stone-100">
            Income vs expense (last 6 months)
          </h2>
          {!trend ? (
            <div className="flex justify-center py-12">
              <Spinner className="h-6 w-6 text-stone-400" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={trend}>
                <CartesianGrid vertical={false} stroke={colors.grid} />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={formatCurrency} tick={{ fontSize: 12 }} />
                <Tooltip content={<ChartTooltip />} />
                <Legend />
                <Bar dataKey="income" name="Income" fill={colors.income} radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" name="Expense" fill={colors.expense} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
              Spending over time
            </h2>
            <div className="flex rounded-lg border border-stone-200 p-0.5 dark:border-stone-700">
              {['daily', 'weekly'].map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`rounded-md px-3 py-1 text-xs font-medium capitalize ${
                    period === p
                      ? 'bg-brand-600 text-white'
                      : 'text-stone-500 dark:text-stone-400'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          {!periodData ? (
            <div className="flex justify-center py-12">
              <Spinner className="h-6 w-6 text-stone-400" />
            </div>
          ) : periodData.length === 0 ? (
            <p className="text-sm text-stone-500 dark:text-stone-400">No data for this period.</p>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={periodData}>
                <CartesianGrid vertical={false} stroke={colors.grid} />
                <XAxis dataKey={period === 'daily' ? 'date' : 'label'} tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={formatCurrency} tick={{ fontSize: 12 }} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="expense" name="Spent" fill={colors.single} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>
    </div>
  )
}

export default Reports
