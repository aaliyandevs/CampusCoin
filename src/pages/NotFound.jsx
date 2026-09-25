import { Link } from 'react-router-dom'
import Button from '../components/common/Button'

function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-stone-50 px-4 text-center dark:bg-stone-950">
      <p className="text-6xl font-bold text-stone-300 dark:text-stone-700">404</p>
      <h1 className="text-xl font-semibold text-stone-900 dark:text-stone-100">Page not found</h1>
      <p className="text-sm text-stone-500 dark:text-stone-400">
        The page you're looking for doesn't exist.
      </p>
      <Link to="/">
        <Button>Go home</Button>
      </Link>
    </div>
  )
}

export default NotFound
