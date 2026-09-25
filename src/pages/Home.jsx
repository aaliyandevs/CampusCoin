import { Link } from 'react-router-dom'
import { PiggyBank } from 'lucide-react'

const sections = [
  {
    title: 'Student',
    links: [
      { to: '/login', label: 'Log in' },
      { to: '/register', label: 'Register' },
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

function Home() {
  return (
    <div className="min-h-screen bg-stone-50 px-4 py-16 dark:bg-stone-950">
      <div className="mx-auto max-w-2xl">
        <div className="mb-10 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600 text-white">
            <PiggyBank className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
              Campus Coin
            </h1>
            <p className="text-sm text-stone-500 dark:text-stone-400">
              Smart spending, student style.
            </p>
          </div>
        </div>

        <div className="mb-8 flex gap-3">
          <Link
            to="/login"
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            Log in
          </Link>
          <Link
            to="/register"
            className="rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200 dark:hover:bg-stone-800"
          >
            Create an account
          </Link>
        </div>

        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-stone-400 dark:text-stone-500">
          Sitemap
        </h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          {sections.map((section) => (
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
    </div>
  )
}

export default Home
