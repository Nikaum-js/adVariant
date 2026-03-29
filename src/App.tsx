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
      <footer className="border-border/30 mt-auto border-t">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <div className="flex flex-col items-center gap-3">
            <div className="text-center">
              <p className="text-foreground text-sm font-medium">Nikolas Santana de Arruda</p>
              <p className="text-muted-foreground text-xs">Software Engineer</p>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://www.linkedin.com/in/nikolas-santana-/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="https://github.com/Nikaum-js"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      <Toaster />
    </div>
  )
}

export default App
