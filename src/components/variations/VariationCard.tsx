import { RotateCcw, ThumbsUp, ThumbsDown } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { CharCounter } from './CharCounter'
import { cn } from '@/lib/utils'
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

export function VariationCard({
  variation,
  headlineLimit,
  descriptionLimit,
  onApprove,
  onReject,
  onReset,
}: VariationCardProps) {
  const isApproved = variation.status === 'approved'
  const isRejected = variation.status === 'rejected'
  const isPending = variation.status === 'pending'

  return (
    <Card
      variant="glass"
      className={cn(
        'animate-in transition-all',
        isApproved && 'ring-success/30 gradient-border-selected ring-2',
        isRejected && 'border-destructive/30 opacity-60'
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          {isApproved ? (
            <Badge variant="success">Aprovado</Badge>
          ) : isRejected ? (
            <Badge variant="destructive">Reprovado</Badge>
          ) : (
            <Badge variant="secondary">Pendente</Badge>
          )}
          <Badge variant="outline" className="text-xs">
            {strategyLabels[variation.strategy] || variation.strategy}
          </Badge>
        </div>
        <CardTitle className="mt-3 text-base leading-snug">{variation.headline}</CardTitle>
        <CardDescription className="flex items-center gap-1 text-xs">
          <CharCounter current={variation.charCount.headline} limit={headlineLimit} />
          <span className="text-muted-foreground">caracteres</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-muted-foreground text-sm leading-relaxed">{variation.description}</p>
        <p className="flex items-center gap-1 text-xs">
          <CharCounter current={variation.charCount.description} limit={descriptionLimit} />
          <span className="text-muted-foreground">caracteres</span>
        </p>
      </CardContent>
      <div className="flex gap-2 p-4 pt-0">
        {isPending ? (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 border-success/30 bg-success/10 text-success hover:bg-success hover:text-success-foreground"
                  onClick={onApprove}
                >
                  <ThumbsUp className="mr-1.5 h-4 w-4" />
                  Aprovar
                </Button>
              </TooltipTrigger>
              <TooltipContent>Incluir na exportação</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  onClick={onReject}
                >
                  <ThumbsDown className="mr-1.5 h-4 w-4" />
                  Reprovar
                </Button>
              </TooltipTrigger>
              <TooltipContent>Descartar variação</TooltipContent>
            </Tooltip>
          </>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="sm" variant="ghost" className="flex-1" onClick={onReset}>
                <RotateCcw className="mr-1.5 h-4 w-4" />
                Voltar para pendente
              </Button>
            </TooltipTrigger>
            <TooltipContent>Desfazer decisão</TooltipContent>
          </Tooltip>
        )}
      </div>
    </Card>
  )
}
