import { Pin, PinOff, X, TrendingUp, AlertTriangle } from 'lucide-react'
import { formatCurrency } from '../../utils/format'
import { cn } from '../../utils/cn'

const kindIcon = { AVERAGE_SPIKE: TrendingUp, BUDGET_EXCEEDED: AlertTriangle }

function SavingTipCard({ tip, onPin, onDismiss }) {
  const Icon = kindIcon[tip.kind] ?? TrendingUp

  return (
    <div className="flex items-start gap-3 rounded-lg border border-stone-100 p-3 dark:border-stone-800">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
        <Icon className="h-4 w-4" />
      </span>
      <div className="flex-1">
        <p className="text-sm text-stone-700 dark:text-stone-300">{tip.tipText}</p>
        <p className="mt-1 text-xs font-medium text-brand-600 dark:text-brand-400">
          Potential savings: {formatCurrency(tip.impactScore)}
        </p>
      </div>
      <div className="flex shrink-0 gap-1">
        <button
          onClick={() => onPin(tip)}
          aria-label={tip.isPinned ? 'Unpin tip' : 'Pin tip'}
          className={cn(
            'rounded-md p-1.5 hover:bg-stone-100 dark:hover:bg-stone-800',
            tip.isPinned
              ? 'text-brand-600 dark:text-brand-400'
              : 'text-stone-400 dark:text-stone-500',
          )}
        >
          {tip.isPinned ? <Pin className="h-4 w-4 fill-current" /> : <PinOff className="h-4 w-4" />}
        </button>
        <button
          onClick={() => onDismiss(tip)}
          aria-label="Dismiss tip"
          className="rounded-md p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-600 dark:hover:bg-stone-800"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export default SavingTipCard
