import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { VariationCard } from './VariationCard'
import { cn } from '@/lib/utils'
import type { Variation, VariationStatus } from '@/types'

interface VariationGridProps {
  variations: Variation[]
  headlineLimit: number
  descriptionLimit: number
  onUpdateStatus: (id: number, status: VariationStatus) => void
}

type FilterStatus = 'all' | VariationStatus

interface FilterOption {
  value: FilterStatus
  label: string
  count: number
  variant: 'default' | 'secondary' | 'success-muted' | 'destructive'
}

export function VariationGrid({
  variations,
  headlineLimit,
  descriptionLimit,
  onUpdateStatus,
}: VariationGridProps) {
  const [filter, setFilter] = useState<FilterStatus>('all')

  const filteredVariations =
    filter === 'all' ? variations : variations.filter((v) => v.status === filter)

  const approvedCount = variations.filter((v) => v.status === 'approved').length
  const rejectedCount = variations.filter((v) => v.status === 'rejected').length
  const pendingCount = variations.filter((v) => v.status === 'pending').length

  const filterOptions: FilterOption[] = [
    { value: 'all', label: 'Todas', count: variations.length, variant: 'default' },
    { value: 'pending', label: 'Pendentes', count: pendingCount, variant: 'secondary' },
    { value: 'approved', label: 'Aprovadas', count: approvedCount, variant: 'success-muted' },
    { value: 'rejected', label: 'Reprovadas', count: rejectedCount, variant: 'destructive' },
  ]

  return (
    <div className="space-y-6">
      {/* Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {filterOptions.map((option) => {
          const isActive = filter === option.value

          return (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={cn(
                'press-scale inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              )}
            >
              {option.label}
              <Badge
                variant={isActive ? 'secondary' : option.variant}
                className={cn('h-5 min-w-[20px] px-1.5', isActive && 'bg-primary-foreground/20')}
              >
                {option.count}
              </Badge>
            </button>
          )
        })}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredVariations.map((variation) => (
          <VariationCard
            key={variation.id}
            variation={variation}
            headlineLimit={headlineLimit}
            descriptionLimit={descriptionLimit}
            onApprove={() => onUpdateStatus(variation.id, 'approved')}
            onReject={() => onUpdateStatus(variation.id, 'rejected')}
            onReset={() => onUpdateStatus(variation.id, 'pending')}
          />
        ))}
      </div>

      {filteredVariations.length === 0 && (
        <p className="text-muted-foreground py-12 text-center">
          Nenhuma variação encontrada com o filtro selecionado.
        </p>
      )}
    </div>
  )
}
