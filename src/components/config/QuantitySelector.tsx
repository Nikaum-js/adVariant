import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Quantity = 5 | 10 | 15 | 20

interface QuantitySelectorProps {
  value: Quantity | undefined
  onChange: (quantity: Quantity) => void
}

const QUANTITIES: Quantity[] = [5, 10, 15, 20]

export function QuantitySelector({ value, onChange }: QuantitySelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Quantidade de Variações</h3>
        <p className="text-muted-foreground text-sm">Quantas variações de copy deseja gerar?</p>
      </div>

      <div className="flex flex-wrap gap-3">
        {QUANTITIES.map((qty) => {
          const isSelected = value === qty

          return (
            <Button
              key={qty}
              type="button"
              variant={isSelected ? 'default' : 'outline'}
              className={cn('min-w-[80px]', isSelected && 'ring-primary/20 ring-2')}
              onClick={() => onChange(qty)}
            >
              {qty} variações
            </Button>
          )
        })}
      </div>
    </div>
  )
}
