import { forwardRef } from 'react'
import { cn } from '../../utils/cn'

const Select = forwardRef(function Select({ label, error, className, id, children, ...props }, ref) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-stone-700 dark:text-stone-300">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={id}
        className={cn(
          'h-10 rounded-lg border border-stone-300 bg-white px-3 text-sm text-stone-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100',
          error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/30',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>}
    </div>
  )
})

export default Select
