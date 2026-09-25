import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  PiggyBank,
  Receipt,
  Target,
  BarChart3,
  Lightbulb,
  Repeat,
  FileDown,
  ArrowRight,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Button from '../components/common/Button'
import { cn } from '../utils/cn'

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

function Reveal({ children, className, delay = 0 }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{ transitionDelay: visible ? `${delay}ms` : '0ms' }}
      className={cn(
        'transition-all duration-700 ease-out',
        visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0',
        className,
      )}
    >
      {children}
    </div>
  )
}

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">
        <PiggyBank className="h-5 w-5" />
      </span>
      <span className="font-display text-base font-semibold text-stone-900 dark:text-stone-100">
        Campus Coin
      </span>
    </Link>
  )
}

function Home() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen overflow-x-hidden bg-stone-50 dark:bg-stone-950">
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-4 py-6 sm:px-6">
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
                className="text-sm font-medium text-stone-600 transition-colors hover:text-brand-600 dark:text-stone-300 dark:hover:text-brand-400"
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
        <section className="relative isolate px-4 py-20 text-center sm:px-6 sm:py-28">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
          >
            <div className="animate-blob absolute -top-24 left-1/2 h-72 w-72 -translate-x-[60%] rounded-full bg-brand-300/40 blur-3xl dark:bg-brand-700/20" />
            <div className="animate-blob absolute top-10 right-1/4 h-64 w-64 rounded-full bg-brand-200/50 blur-3xl [animation-delay:4s] dark:bg-brand-800/20" />
          </div>

          <div className="animate-fade-up mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-stone-200 bg-white/80 px-4 py-1.5 text-xs font-medium text-stone-600 shadow-sm backdrop-blur dark:border-stone-800 dark:bg-stone-900/80 dark:text-stone-300">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
            Built for student budgets
          </div>

          <h1 className="animate-fade-up mx-auto max-w-2xl font-display text-4xl font-bold tracking-tight text-stone-900 [animation-delay:80ms] dark:text-stone-100 sm:text-6xl">
            Smart spending,{' '}
            <span className="bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent dark:from-brand-400 dark:to-brand-200">
              student style.
            </span>
          </h1>
          <p className="animate-fade-up mx-auto mt-5 max-w-xl text-lg text-stone-600 [animation-delay:160ms] dark:text-stone-400">
            Track spending, stick to a budget, and build better money habits — without the
            spreadsheet.
          </p>
          <div className="animate-fade-up mt-9 flex flex-wrap items-center justify-center gap-3 [animation-delay:240ms]">
            <Link to={user ? '/dashboard' : '/register'}>
              <Button
                size="lg"
                className="group shadow-lg shadow-brand-600/20 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand-600/30"
              >
                {user ? 'Go to dashboard' : 'Create a free account'}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
            {!user && (
              <Link to="/login">
                <Button
                  variant="secondary"
                  size="lg"
                  className="hover:-translate-y-0.5"
                >
                  Log in
                </Button>
              </Link>
            )}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
          <Reveal className="mx-auto mb-12 max-w-xl text-center">
            <h2 className="font-display text-2xl font-bold text-stone-900 dark:text-stone-100 sm:text-3xl">
              Everything you need to stay on budget
            </h2>
            <p className="mt-2 text-stone-500 dark:text-stone-400">
              One place for transactions, budgets, and the insights that keep you on track.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, description }, index) => (
              <Reveal key={title} delay={index * 60}>
                <div className="group h-full rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg dark:border-stone-800 dark:bg-stone-900 dark:hover:border-brand-800">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700 transition-transform duration-300 group-hover:scale-110 dark:bg-brand-900/40 dark:text-brand-300">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-display text-base font-semibold text-stone-900 dark:text-stone-100">
                    {title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-stone-500 dark:text-stone-400">
                    {description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {!user && (
          <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
            <Reveal>
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 px-8 py-14 text-center shadow-xl sm:px-16">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle at 20% 20%, white 0%, transparent 40%), radial-gradient(circle at 80% 60%, white 0%, transparent 35%)',
                  }}
                />
                <h2 className="relative font-display text-2xl font-bold text-white sm:text-3xl">
                  Ready to take control of your spending?
                </h2>
                <p className="relative mx-auto mt-3 max-w-md text-brand-50/90">
                  It takes less than a minute to set up. No credit card, no spreadsheets.
                </p>
                <Link to="/register" className="relative mt-7 inline-block">
                  <Button variant="inverse" size="lg" className="shadow-lg hover:-translate-y-0.5">
                    Create a free account
                  </Button>
                </Link>
              </div>
            </Reveal>
          </section>
        )}
      </main>

      <footer className="border-t border-stone-200 dark:border-stone-800">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-stone-500 dark:text-stone-400 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-600 text-white">
              <PiggyBank className="h-3.5 w-3.5" />
            </span>
            <span>Campus Coin — smart spending, student style.</span>
          </div>
          <div className="flex items-center gap-5">
            <Link to="/login" className="hover:text-brand-600 dark:hover:text-brand-400">
              Log in
            </Link>
            <Link to="/register" className="hover:text-brand-600 dark:hover:text-brand-400">
              Register
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
