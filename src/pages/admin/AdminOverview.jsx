import { useEffect, useState } from 'react'
import { Users, Receipt, TrendingUp } from 'lucide-react'
import Card from '../../components/common/Card'
import Spinner from '../../components/common/Spinner'
import { getAdminStats } from '../../api/admin.api'

function StatCard({ icon: Icon, label, value }) {
  return (
    <Card className="flex items-center gap-4">
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-sm text-stone-500 dark:text-stone-400">{label}</p>
        <p className="text-xl font-semibold text-stone-900 dark:text-stone-100">{value}</p>
      </div>
    </Card>
  )
}

function AdminOverview() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    getAdminStats().then(setStats)
  }, [])

  if (!stats) {
    return (
      <div className="flex justify-center py-12">
        <Spinner className="h-6 w-6 text-stone-400" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100">Overview</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={Users} label="Active students" value={stats.activeUsers} />
        <StatCard icon={Receipt} label="Total transactions" value={stats.totalTransactions} />
        <StatCard
          icon={TrendingUp}
          label="Top category"
          value={stats.mostUsedCategories[0]?.categoryName ?? '—'}
        />
      </div>

      <Card>
        <h2 className="mb-4 text-sm font-semibold text-stone-900 dark:text-stone-100">
          Most-used categories
        </h2>
        <ul className="flex flex-col gap-2">
          {stats.mostUsedCategories.map((c) => (
            <li
              key={c.categoryId}
              className="flex items-center justify-between border-b border-stone-100 py-2 text-sm last:border-0 dark:border-stone-800"
            >
              <span className="text-stone-700 dark:text-stone-300">{c.categoryName}</span>
              <span className="text-stone-500 dark:text-stone-400">
                {c.transactionCount} transactions
              </span>
            </li>
          ))}
          {stats.mostUsedCategories.length === 0 && (
            <p className="text-sm text-stone-500 dark:text-stone-400">No data yet.</p>
          )}
        </ul>
      </Card>
    </div>
  )
}

export default AdminOverview
