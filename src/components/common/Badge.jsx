import { cn } from '../../utils/cn'

const tones = {
  neutral: 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300',
  brand: 'bg-brand-100 text-brand-800 dark:bg-brand-900 dark:text-brand-200',
  success: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
  warning: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  danger: 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200',
}

function Badge({ tone = 'neutral', className, children }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

export default Badge
