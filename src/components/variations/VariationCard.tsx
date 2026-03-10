import { Check, X, RotateCcw } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CharCounter } from './CharCounter'
import type { Variation } from '@/types'

interface VariationCardProps {
  variation: Variation
  headlineLimit: number
  descriptionLimit: number
  onApprove: () => void
  onReject: () => void
  onReset: () => void
}

const strategyLabels: Record<string, string> = {
  social_proof: 'Prova Social',
  direct_benefit: 'Benefício Direto',
  scarcity: 'Escassez',
  provocative_question: 'Pergunta',
  authority: 'Autoridade',
  transformation: 'Transformação',
}

const statusStyles = {
  pending: '',
  approved: 'border-success/50 bg-success-muted',
  rejected: 'border-destructive/50 bg-destructive/5',
}

export function VariationCard({
  variation,
  headlineLimit,
  descriptionLimit,
  onApprove,
  onReject,
  onReset,
}: VariationCardProps) {
  return (
    <Card className={statusStyles[variation.status]}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          {variation.status === 'approved' ? (
            <Badge className="bg-success text-success-foreground">Aprovado</Badge>
          ) : variation.status === 'rejected' ? (
            <Badge variant="destructive">Reprovado</Badge>
          ) : (
            <Badge variant="secondary">Pendente</Badge>
          )}
          <Badge variant="outline">
            {strategyLabels[variation.strategy] || variation.strategy}
          </Badge>
        </div>
        <CardTitle className="mt-2 text-lg">{variation.headline}</CardTitle>
        <CardDescription className="flex items-center gap-1">
          <CharCounter current={variation.charCount.headline} limit={headlineLimit} />
          <span className="text-muted-foreground">caracteres</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">{variation.description}</p>
        <p className="mt-2 flex items-center gap-1 text-xs">
          <CharCounter current={variation.charCount.description} limit={descriptionLimit} />
          <span className="text-muted-foreground">caracteres</span>
        </p>
      </CardContent>
      <div className="flex gap-2 p-4 pt-0">
        {variation.status === 'pending' ? (
          <>
            <Button
              size="sm"
              className="bg-success hover:bg-success/90 text-success-foreground flex-1"
              onClick={onApprove}
            >
              <Check className="mr-1 h-4 w-4" />
              Aprovar
            </Button>
            <Button size="sm" variant="destructive" className="flex-1" onClick={onReject}>
              <X className="mr-1 h-4 w-4" />
              Reprovar
            </Button>
          </>
        ) : (
          <Button size="sm" variant="outline" className="flex-1" onClick={onReset}>
            <RotateCcw className="mr-1 h-4 w-4" />
            Resetar
          </Button>
        )}
      </div>
    </Card>
  )
}
