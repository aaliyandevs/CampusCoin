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
  UserPlus,
  ListChecks,
  TrendingUp,
  ShieldCheck,
  Zap,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Button from '../components/common/Button'
import SiteFooter from '../components/layout/SiteFooter'
import { cn } from '../utils/cn'
import logoFull from '../assets/logo-full.png'

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

const steps = [
  {
    icon: UserPlus,
    title: 'Create your account',
    description: 'Sign up in under a minute. No bank linking, no card required.',
  },
  {
    icon: ListChecks,
    title: 'Log what comes and goes',
    description: 'Quick-add income and expenses into categories built for student life.',
  },
  {
    icon: TrendingUp,
    title: 'Watch your habits improve',
    description: 'Budgets, trends, and saving tips keep you a step ahead each month.',
  },
]

const highlights = [
  { icon: ShieldCheck, label: 'No bank linking required' },
  { icon: Zap, label: 'Set up in under a minute' },
  { icon: PiggyBank, label: 'Built specifically for students' },
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
    <Link to="/" className="flex shrink-0 items-center">
      <img src={logoFull} alt="Campus Coin" className="h-8 w-auto sm:h-10" />
    </Link>
  )
}

function DashboardPreview() {
  const bars = [38, 62, 34, 78, 52, 88, 58]
  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div className="rounded-2xl border border-stone-200 bg-white/95 p-5 shadow-2xl shadow-brand-900/10 backdrop-blur dark:border-stone-800 dark:bg-stone-900/95">
        <div className="mb-4 flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-brand-400" />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-lg bg-brand-50 p-2.5 dark:bg-brand-900/30">
            <p className="text-[10px] font-medium text-brand-700 dark:text-brand-300">Income</p>
            <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">$720</p>
          </div>
          <div className="rounded-lg bg-amber-50 p-2.5 dark:bg-amber-900/30">
            <p className="text-[10px] font-medium text-amber-700 dark:text-amber-300">Expenses</p>
            <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">$519</p>
          </div>
          <div className="rounded-lg bg-stone-100 p-2.5 dark:bg-stone-800">
            <p className="text-[10px] font-medium text-stone-500 dark:text-stone-400">Balance</p>
            <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">$201</p>
          </div>
        </div>

        <div className="mt-4 flex h-20 items-end gap-1.5">
          {bars.map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t bg-gradient-to-t from-brand-600 to-brand-400"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-stone-600 dark:text-stone-300">Food budget</span>
            <span className="font-medium text-stone-900 dark:text-stone-100">64%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-stone-100 dark:bg-stone-800">
            <div className="h-full w-[64%] rounded-full bg-brand-500" />
          </div>
        </div>
      </div>

      <div className="animate-fade-up absolute -right-5 -top-5 flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-medium text-brand-700 shadow-lg [animation-delay:500ms] dark:border-stone-800 dark:bg-stone-900 dark:text-brand-300">
        <Lightbulb className="h-3.5 w-3.5" />
        Saved $42 this week
      </div>
    </div>
  )
}

function Home() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen overflow-x-hidden bg-stone-50 dark:bg-stone-950">
      <header className="sticky top-0 z-30 border-b border-stone-200/60 bg-stone-50/75 backdrop-blur-lg dark:border-stone-800/60 dark:bg-stone-950/75">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-3 py-4 sm:px-6">
          <Logo />
          <nav className="flex shrink-0 items-center gap-1.5 sm:gap-3">
            {user ? (
              <Link to="/dashboard">
                <Button size="sm">Go to dashboard</Button>
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="whitespace-nowrap px-1 text-sm font-medium text-stone-600 transition-colors hover:text-brand-600 dark:text-stone-300 dark:hover:text-brand-400"
                >
                  Log in
                </Link>
                <Link to="/register">
                  <Button size="sm" className="whitespace-nowrap px-2.5 sm:px-3">
                    Sign up
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main>
        <section className="relative isolate overflow-hidden px-4 pb-20 pt-14 sm:px-6 sm:pb-28 sm:pt-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
          >
            <div className="animate-blob absolute -top-24 left-1/2 h-72 w-72 -translate-x-[60%] rounded-full bg-brand-300/40 blur-3xl dark:bg-brand-700/20" />
            <div className="animate-blob absolute top-10 right-1/4 h-64 w-64 rounded-full bg-brand-200/50 blur-3xl [animation-delay:4s] dark:bg-brand-800/20" />
          </div>

          <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">
            <div className="text-center lg:text-left">
              <h1 className="animate-fade-up font-display text-4xl font-bold tracking-tight text-stone-900 dark:text-stone-100 sm:text-6xl">
                Smart spending,{' '}
                <span className="bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent dark:from-brand-400 dark:to-brand-200">
                  student style.
                </span>
              </h1>
              <p className="animate-fade-up mx-auto mt-5 max-w-xl text-lg text-stone-600 [animation-delay:160ms] dark:text-stone-400 lg:mx-0">
                Track spending, stick to a budget, and build better money habits — without the
                spreadsheet.
              </p>
              <div className="animate-fade-up mt-9 flex flex-wrap items-center justify-center gap-3 [animation-delay:240ms] lg:justify-start">
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
                    <Button variant="secondary" size="lg" className="hover:-translate-y-0.5">
                      Log in
                    </Button>
                  </Link>
                )}
              </div>

              <div className="animate-fade-up mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-stone-500 [animation-delay:320ms] dark:text-stone-400 lg:justify-start">
                {highlights.map(({ icon: Icon, label }) => (
                  <span key={label} className="flex items-center gap-1.5">
                    <Icon className="h-3.5 w-3.5 text-brand-500" />
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <div className="animate-fade-up hidden [animation-delay:200ms] lg:block">
              <DashboardPreview />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
          <Reveal className="mx-auto mb-12 max-w-xl text-center">
            <h2 className="font-display text-2xl font-bold text-stone-900 dark:text-stone-100 sm:text-3xl">
              Three steps to better money habits
            </h2>
            <p className="mt-2 text-stone-500 dark:text-stone-400">
              No spreadsheets, no bank linking, no learning curve.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {steps.map(({ icon: Icon, title, description }, index) => (
              <Reveal key={title} delay={index * 100} className="relative text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-brand-500 text-white shadow-lg shadow-brand-600/20">
                  <Icon className="h-6 w-6" />
                </div>
                <span className="mt-3 block font-display text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                  Step {index + 1}
                </span>
                <h3 className="mt-1 font-display text-lg font-semibold text-stone-900 dark:text-stone-100">
                  {title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-stone-500 dark:text-stone-400">
                  {description}
                </p>
              </Reveal>
            ))}
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
                <div className="group relative h-full overflow-hidden rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg dark:border-stone-800 dark:bg-stone-900 dark:hover:border-brand-800">
                  <span className="absolute inset-x-0 top-0 h-0.5 scale-x-0 bg-gradient-to-r from-brand-600 to-brand-400 transition-transform duration-300 group-hover:scale-x-100" />
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-100 to-brand-50 text-brand-700 transition-transform duration-300 group-hover:scale-110 dark:from-brand-900/50 dark:to-brand-900/20 dark:text-brand-300">
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

      <SiteFooter />
    </div>
  )
}

export default Home
