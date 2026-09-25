import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Menu, Moon, Sun } from 'lucide-react'
import Sidebar from './Sidebar'
import Breadcrumbs from './Breadcrumbs'
import { useTheme } from '../../context/ThemeContext'

function AppShell() {
  const { theme, toggleTheme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-stone-50 dark:bg-stone-950">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="flex-1">
        <header className="flex h-14 items-center justify-between border-b border-stone-200 bg-white px-4 dark:border-stone-800 dark:bg-stone-900 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="rounded-lg p-2 text-stone-500 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800 md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <Breadcrumbs />
          </div>
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="rounded-lg p-2 text-stone-500 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </header>
        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppShell
