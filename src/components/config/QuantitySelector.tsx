import { Card, CardContent, CardDescription } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type Quantity = 5 | 10 | 15 | 20

interface QuantitySelectorProps {
  value: Quantity | undefined
  onChange: (quantity: Quantity) => void
}

const QUANTITY_OPTIONS: { value: Quantity; label: string; description: string }[] = [
  { value: 5, label: '5', description: 'Teste rápido' },
  { value: 10, label: '10', description: 'Recomendado' },
  { value: 15, label: '15', description: 'Mais opções' },
  { value: 20, label: '20', description: 'Máximo' },
]

export function QuantitySelector({ value, onChange }: QuantitySelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Quantidade de Variações</h3>
        <p className="text-muted-foreground text-sm">Quantas variações de copy deseja gerar?</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {QUANTITY_OPTIONS.map((option) => {
          const isSelected = value === option.value

          return (
            <Card
              key={option.value}
              className={cn(
                'hover-lift press-scale cursor-pointer transition-all',
                isSelected
                  ? 'gradient-border-selected ring-primary/30 border-transparent ring-2'
                  : 'hover:border-primary/50'
              )}
              onClick={() => onChange(option.value)}
            >
              <CardContent className="flex flex-col items-center justify-center p-4 text-center">
                <span
                  className={cn(
                    'text-3xl font-bold transition-colors',
                    isSelected ? 'text-primary' : 'text-foreground'
                  )}
                >
                  {option.label}
                </span>
                <CardDescription className="mt-1 text-xs">{option.description}</CardDescription>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
