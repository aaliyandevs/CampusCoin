import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Receipt,
  Tags,
  Target,
  BarChart3,
  UserRound,
  LogOut,
  X,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { cn } from '../../utils/cn'
import logoFull from '../../assets/logo-full.png'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/transactions', label: 'Transactions', icon: Receipt },
  { to: '/categories', label: 'Categories', icon: Tags },
  { to: '/budgets', label: 'Budgets', icon: Target },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
  { to: '/profile', label: 'Profile', icon: UserRound },
]

function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth()

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex h-screen w-60 shrink-0 flex-col border-r border-stone-200 bg-white shadow-2xl transition-transform dark:border-stone-800 dark:bg-stone-900 md:sticky md:top-0 md:shadow-none md:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex items-center justify-between gap-2 px-5 py-5">
          <div className="flex items-center gap-2">
            <img src={logoFull} alt="Campus Coin" className="h-9 w-auto" />
          </div>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-lg p-1 text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 md:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300'
                    : 'text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800',
                )
              }
            >
              <Icon className="h-5 w-5" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-stone-200 px-3 py-4 dark:border-stone-800">
          <div className="mb-2 truncate px-3 text-sm text-stone-500 dark:text-stone-400">
            {user?.name}
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800"
          >
            <LogOut className="h-5 w-5" />
            Log out
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
