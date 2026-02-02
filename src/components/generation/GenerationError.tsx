import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface GenerationErrorProps {
  error: Error | null
  onBack: () => void
  onRetry: () => void
}

export function GenerationError({ error, onBack, onRetry }: GenerationErrorProps) {
  return (
    <Card variant="glass" className="border-destructive/30 mx-auto max-w-md">
      <CardHeader>
        <div className="flex items-center justify-center gap-2">
          <AlertCircle className="text-destructive h-6 w-6" />
          <CardTitle className="text-destructive">Erro na Geração</CardTitle>
        </div>
        <CardDescription>
          {error instanceof Error ? error.message : 'Ocorreu um erro ao gerar as variações'}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center gap-4">
        <Button variant="outline" onClick={onBack}>
          Voltar
        </Button>
        <Button onClick={onRetry}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Tentar Novamente
        </Button>
      </CardContent>
    </Card>
  )
}
