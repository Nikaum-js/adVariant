import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { VariationCard } from './VariationCard'
import type { Variation, VariationStatus } from '@/types'

interface VariationGridProps {
  variations: Variation[]
  headlineLimit: number
  descriptionLimit: number
  onUpdateStatus: (id: number, status: VariationStatus) => void
}

type FilterStatus = 'all' | VariationStatus

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

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
        >
          Todas ({variations.length})
        </Button>
        <Button
          size="sm"
          variant={filter === 'pending' ? 'default' : 'outline'}
          onClick={() => setFilter('pending')}
        >
          Pendentes ({pendingCount})
        </Button>
        <Button
          size="sm"
          variant={filter === 'approved' ? 'default' : 'outline'}
          onClick={() => setFilter('approved')}
          className={
            filter === 'approved' ? 'bg-success hover:bg-success/90 text-success-foreground' : ''
          }
        >
          Aprovadas ({approvedCount})
        </Button>
        <Button
          size="sm"
          variant={filter === 'rejected' ? 'destructive' : 'outline'}
          onClick={() => setFilter('rejected')}
        >
          Reprovadas ({rejectedCount})
        </Button>
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
        <p className="text-muted-foreground py-8 text-center">
          Nenhuma variação encontrada com o filtro selecionado.
        </p>
      )}
    </div>
  )
}
