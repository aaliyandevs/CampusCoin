import { useAuth } from '../../context/AuthContext'
import Card from '../../components/common/Card'

function Dashboard() {
  const { user } = useAuth()
  const firstName = user?.name?.split(' ')[0]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100">
          Welcome back, {firstName}
        </h1>
        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
          Here's where your spending overview will live.
        </p>
      </div>
      <Card>
        <p className="text-sm text-stone-500 dark:text-stone-400">
          Dashboard widgets are coming next.
        </p>
      </Card>
    </div>
  )
}

export default Dashboard
