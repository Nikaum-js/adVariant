import { cn } from '@/lib/utils'

interface CharCounterProps {
  current: number
  limit: number
  className?: string
}

export function CharCounter({ current, limit, className }: CharCounterProps) {
  const percentage = (current / limit) * 100

  const getColorClass = () => {
    if (percentage > 100) {
      return 'text-destructive'
    }
    if (percentage >= 90) {
      return 'text-warning'
    }
    return 'text-success'
  }

  return (
    <span className={cn('text-xs font-medium', getColorClass(), className)}>
      {current}/{limit}
    </span>
  )
}
