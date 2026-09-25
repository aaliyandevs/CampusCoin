import { cn } from '../../utils/cn'

function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'rounded-xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card
