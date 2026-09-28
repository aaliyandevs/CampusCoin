import { Link } from 'react-router-dom'
import Card from '../common/Card'
import logoFull from '../../assets/logo-full.png'

function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50 px-4 dark:bg-stone-950">
      <div className="w-full max-w-sm">
        <Link to="/" className="mb-8 flex items-center justify-center">
          <img src={logoFull} alt="Campus Coin" className="h-11 w-auto" />
        </Link>

        <Card>
          <h1 className="text-xl font-semibold text-stone-900 dark:text-stone-100">{title}</h1>
          {subtitle && (
            <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">{subtitle}</p>
          )}
          <div className="mt-6">{children}</div>
        </Card>

        {footer && <div className="mt-4 text-center text-sm">{footer}</div>}
      </div>
    </div>
  )
}

export default AuthLayout
