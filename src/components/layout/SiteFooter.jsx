import { Link } from 'react-router-dom'
import logoFull from '../../assets/logo-full.png'

function SiteFooter() {
  return (
    <footer className="border-t border-stone-200 dark:border-stone-800">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-stone-500 dark:text-stone-400 sm:flex-row sm:px-6">
        <div className="flex items-center gap-2">
          <img src={logoFull} alt="Campus Coin" className="h-7 w-auto" />
          <span>— smart spending, student style.</span>
        </div>
        <div className="flex items-center gap-5">
          <Link to="/terms" className="hover:text-brand-600 dark:hover:text-brand-400">
            Terms & Conditions
          </Link>
          <Link to="/privacy" className="hover:text-brand-600 dark:hover:text-brand-400">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default SiteFooter
