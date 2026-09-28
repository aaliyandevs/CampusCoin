import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import logoFull from '../../assets/logo-full.png'

function LegalLayout({ title, updated, children }) {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <header className="border-b border-stone-200 bg-white/80 backdrop-blur dark:border-stone-800 dark:bg-stone-950/80">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/" className="flex shrink-0 items-center">
            <img src={logoFull} alt="Campus Coin" className="h-7 w-auto" />
          </Link>
          <Link
            to="/"
            className="flex items-center gap-1.5 text-sm font-medium text-stone-600 transition-colors hover:text-brand-600 dark:text-stone-300 dark:hover:text-brand-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="font-display text-3xl font-bold text-stone-900 dark:text-stone-100 sm:text-4xl">
          {title}
        </h1>
        <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">Last updated: {updated}</p>

        <div className="mt-10 flex flex-col gap-8">{children}</div>
      </main>

      <footer className="border-t border-stone-200 dark:border-stone-800">
        <div className="mx-auto flex max-w-3xl items-center gap-2 px-4 py-8 text-sm text-stone-500 dark:text-stone-400 sm:px-6">
          <img src={logoFull} alt="Campus Coin" className="h-6 w-auto" />
          <span>— smart spending, student style.</span>
        </div>
      </footer>
    </div>
  )
}

export function Section({ title, children }) {
  return (
    <section>
      <h2 className="font-display text-xl font-semibold text-stone-900 dark:text-stone-100">
        {title}
      </h2>
      <div className="mt-3 flex flex-col gap-3 text-[15px] leading-relaxed text-stone-600 dark:text-stone-400">
        {children}
      </div>
    </section>
  )
}

export function Ul({ children }) {
  return <ul className="flex flex-col gap-1.5 pl-5 [&>li]:list-disc">{children}</ul>
}

export default LegalLayout
