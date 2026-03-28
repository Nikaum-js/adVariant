import { useState } from 'react'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'
import { AlertCircle, RefreshCw, Download, Copy } from 'lucide-react'
import { exportToCSV, copyApprovedToClipboard } from '@/services/export'
import { RateLimitError, NetworkError } from '@/services/deepseek'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { StepIndicator } from '@/components/ui/step-indicator'
import { LoadingScreen } from '@/components/ui/loading-screen'
import { BriefingForm } from '@/components/briefing/BriefingForm'
import { ConfigStep } from '@/components/config/ConfigStep'
import { VariationGrid } from '@/components/variations/VariationGrid'
import { useGenerateVariations } from '@/hooks/useGenerateVariations'
import { CHANNEL_RULES } from '@/lib/channelRules'
import type { BriefingFormData, GenerationConfigData } from '@/schemas/briefing'
import type { Variation, VariationStatus } from '@/types'

type Step = 'briefing' | 'config' | 'generating' | 'review'

function App() {
  const [step, setStep] = useState<Step>('briefing')
  const [briefing, setBriefing] = useState<BriefingFormData | null>(null)
  const [config, setConfig] = useState<GenerationConfigData | null>(null)
  const [variations, setVariations] = useState<Variation[]>([])

  const generateMutation = useGenerateVariations()

  const handleBriefingSubmit = (data: BriefingFormData) => {
    setBriefing(data)
    setStep('config')
  }

  const handleConfigSubmit = async (data: GenerationConfigData) => {
    setConfig(data)
    setStep('generating')

    if (!briefing) return

    try {
      const result = await generateMutation.mutateAsync({
        briefing: {
          product: briefing.product,
          targetAudience: briefing.targetAudience,
          objective: briefing.objective,
          differentials: briefing.differentials,
          requiredKeywords: briefing.requiredKeywords,
          forbiddenWords: briefing.forbiddenWords,
        },
        config: data,
      })

      setVariations(result)
      setStep('review')
      toast.success(`${result.length} variações geradas com sucesso!`)
    } catch (error) {
      if (error instanceof RateLimitError) {
        toast.error('Rate limit atingido. Aguarde 30 segundos e tente novamente.')
      } else if (error instanceof NetworkError) {
        toast.error('Erro de conexão. Verifique sua internet.')
      } else {
        toast.error(error instanceof Error ? error.message : 'Erro ao gerar variações')
      }
      setStep('config')
    }
  }

  const handleRetry = () => {
    if (briefing && config) {
      handleConfigSubmit(config)
    }
  }

  const handleBackToBriefing = () => {
    setStep('briefing')
  }

  const handleBackToConfig = () => {
    setStep('config')
  }

  const handleNewGeneration = () => {
    setVariations([])
    setStep('briefing')
    setBriefing(null)
    setConfig(null)
  }

  const updateVariationStatus = (id: number, status: VariationStatus) => {
    setVariations((prev) => prev.map((v) => (v.id === id ? { ...v, status } : v)))
  }

  const channelRules = config ? CHANNEL_RULES[config.channel] : null

  const handleExportCSV = () => {
    try {
      const count = exportToCSV(variations)
      toast.success(`${count} variações exportadas para CSV!`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao exportar')
    }
  }

  const handleCopyApproved = () => {
    try {
      copyApprovedToClipboard(variations)
      toast.success('Variações copiadas para a área de transferência!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao copiar')
    }
  }

  const approvedCount = variations.filter((v) => v.status === 'approved').length
  const rejectedCount = variations.filter((v) => v.status === 'rejected').length
  const pendingCount = variations.filter((v) => v.status === 'pending').length

  return (
    <div className="bg-glow flex min-h-screen flex-col">
      {/* Progress Indicator */}
      <div className="border-border/50 bg-background/50 border-b backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <StepIndicator
            steps={[
              {
                number: 1,
                label: 'Briefing',
                isActive: step === 'briefing',
                isCompleted: step !== 'briefing',
              },
              {
                number: 2,
                label: 'Configuração',
                isActive: step === 'config',
                isCompleted: step === 'generating' || step === 'review',
              },
              {
                number: 3,
                label: 'Revisão',
                isActive: step === 'generating' || step === 'review',
                isCompleted: step === 'review' && variations.length > 0,
              },
            ]}
          />
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        {step === 'briefing' && (
          <div className="animate-in">
            <BriefingForm onSubmit={handleBriefingSubmit} initialData={briefing || undefined} />
          </div>
        )}

        {step === 'config' && (
          <div className="animate-in">
            <ConfigStep
              onSubmit={handleConfigSubmit}
              onBack={handleBackToBriefing}
              initialData={config || undefined}
            />
          </div>
        )}

        {step === 'generating' && (
          <div className="animate-in">
            {generateMutation.isPending ? (
              <LoadingScreen />
            ) : generateMutation.isError ? (
              <Card variant="glass" className="border-destructive/30 mx-auto max-w-md">
                <CardHeader>
                  <div className="flex items-center justify-center gap-2">
                    <AlertCircle className="text-destructive h-6 w-6" />
                    <CardTitle className="text-destructive">Erro na Geração</CardTitle>
                  </div>
                  <CardDescription>
                    {generateMutation.error instanceof Error
                      ? generateMutation.error.message
                      : 'Ocorreu um erro ao gerar as variações'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center gap-4">
                  <Button variant="outline" onClick={handleBackToConfig}>
                    Voltar
                  </Button>
                  <Button onClick={handleRetry}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Tentar Novamente
                  </Button>
                </CardContent>
              </Card>
            ) : null}
          </div>
        )}

        {step === 'review' && variations.length > 0 && channelRules && (
          <div className="animate-in space-y-6">
            {/* Stats */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">{variations.length} Variações Geradas</h2>
                <p className="text-muted-foreground">
                  {approvedCount} aprovadas · {rejectedCount} reprovadas · {pendingCount} pendentes
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  onClick={handleCopyApproved}
                  disabled={approvedCount === 0}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copiar ({approvedCount})
                </Button>
                <Button variant="gradient" onClick={handleExportCSV} disabled={approvedCount === 0}>
                  <Download className="mr-2 h-4 w-4" />
                  Exportar CSV ({approvedCount})
                </Button>
                <Button variant="outline" onClick={handleNewGeneration}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Nova Geração
                </Button>
              </div>
            </div>

            {/* Variations Grid */}
            <VariationGrid
              variations={variations}
              headlineLimit={channelRules.headlineLimit}
              descriptionLimit={channelRules.descriptionLimit}
              onUpdateStatus={updateVariationStatus}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <p className="text-muted-foreground/50 text-center text-[10px] uppercase tracking-widest">
            Human Technical Test
          </p>
        </div>
      </footer>

      <Toaster />
    </div>
  )
}

export default App
