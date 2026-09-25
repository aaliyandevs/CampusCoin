import { Link, useLocation } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

const labels = {
  dashboard: 'Dashboard',
  transactions: 'Transactions',
  categories: 'Categories',
  budgets: 'Budgets',
  reports: 'Reports',
  profile: 'Profile',
  admin: 'Admin',
  users: 'Users',
  announcements: 'Announcements',
}

function Breadcrumbs() {
  const { pathname } = useLocation()
  const segments = pathname.split('/').filter(Boolean)

  return (
    <nav className="flex items-center gap-1.5 text-sm text-stone-500 dark:text-stone-400">
      {segments.map((segment, index) => {
        const to = '/' + segments.slice(0, index + 1).join('/')
        const isLast = index === segments.length - 1
        const label = labels[segment] ?? segment

        return (
          <span key={to} className="flex items-center gap-1.5">
            {index > 0 && <ChevronRight className="h-3.5 w-3.5" />}
            {isLast ? (
              <span className="font-medium text-stone-900 dark:text-stone-100">{label}</span>
            ) : (
              <Link to={to} className="hover:text-stone-700 dark:hover:text-stone-200">
                {label}
              </Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}

export default Breadcrumbs
