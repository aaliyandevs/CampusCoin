import { Link } from 'react-router-dom'
import {
  PiggyBank,
  Receipt,
  Target,
  BarChart3,
  Lightbulb,
  Repeat,
  FileDown,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Card from '../components/common/Card'
import Button from '../components/common/Button'

const features = [
  {
    icon: Receipt,
    title: 'Track every transaction',
    description: 'Log income and expenses in seconds and see exactly where your money goes.',
  },
  {
    icon: Target,
    title: 'Set monthly budgets',
    description: 'Cap spending by category and get warned before you go over.',
  },
  {
    icon: BarChart3,
    title: 'Visual reports',
    description: 'Charts that break down spending by category, month, and trend over time.',
  },
  {
    icon: Lightbulb,
    title: 'Smart saving tips',
    description: 'Automatic nudges when a category spikes above your usual average.',
  },
  {
    icon: Repeat,
    title: 'Recurring transactions',
    description: 'Set it once for rent or subscriptions and let Campus Coin log it for you.',
  },
  {
    icon: FileDown,
    title: 'CSV import & PDF export',
    description: 'Bring in existing records or export a report to share or print.',
  },
]

const sitemap = [
  {
    title: 'Student',
    links: [
      { to: '/register', label: 'Create an account' },
      { to: '/login', label: 'Log in' },
      { to: '/forgot-password', label: 'Forgot password' },
      { to: '/dashboard', label: 'Dashboard' },
      { to: '/transactions', label: 'Transactions' },
      { to: '/categories', label: 'Categories' },
      { to: '/budgets', label: 'Budgets' },
      { to: '/reports', label: 'Reports' },
      { to: '/profile', label: 'Profile' },
    ],
  },
  {
    title: 'Admin',
    links: [
      { to: '/admin/login', label: 'Admin login' },
      { to: '/admin', label: 'Admin overview' },
      { to: '/admin/users', label: 'Manage users' },
      { to: '/admin/categories', label: 'Manage categories' },
      { to: '/admin/announcements', label: 'Announcements' },
    ],
  },
]

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">
        <PiggyBank className="h-5 w-5" />
      </span>
      <span className="font-semibold text-stone-900 dark:text-stone-100">Campus Coin</span>
    </Link>
  )
}

function Home() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6 sm:px-6">
        <Logo />
        <nav className="flex items-center gap-3">
          {user ? (
            <Link to="/dashboard">
              <Button size="sm">Go to dashboard</Button>
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-stone-600 hover:text-brand-600 dark:text-stone-300 dark:hover:text-brand-400"
              >
                Log in
              </Link>
              <Link to="/register">
                <Button size="sm">Create account</Button>
              </Link>
            </>
          )}
        </nav>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 sm:py-24">
          <h1 className="mx-auto max-w-2xl text-4xl font-bold tracking-tight text-stone-900 dark:text-stone-100 sm:text-5xl">
            Smart spending, student style.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-stone-600 dark:text-stone-400">
            Campus Coin helps students track spending, stick to a budget, and build better money
            habits — without the spreadsheet.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to={user ? '/dashboard' : '/register'}>
              <Button size="lg">{user ? 'Go to dashboard' : 'Create a free account'}</Button>
            </Link>
            {!user && (
              <Link to="/login">
                <Button variant="secondary" size="lg">
                  Log in
                </Button>
              </Link>
            )}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-24">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, description }) => (
              <Card key={title}>
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-sm font-semibold text-stone-900 dark:text-stone-100">
                  {title}
                </h3>
                <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">{description}</p>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <h2 className="mb-6 text-xs font-semibold uppercase tracking-wide text-stone-400 dark:text-stone-500">
            Sitemap
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            {sitemap.map((section) => (
              <div key={section.title}>
                <h3 className="mb-2 text-sm font-semibold text-stone-900 dark:text-stone-100">
                  {section.title}
                </h3>
                <ul className="flex flex-col gap-1.5">
                  {section.links.map((link) => (
                    <li key={link.to}>
                      <Link
                        to={link.to}
                        className="text-sm text-stone-600 hover:text-brand-600 dark:text-stone-400 dark:hover:text-brand-400"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
