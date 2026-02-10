import { useState } from 'react'
import { toast } from 'sonner'
import { exportToCSV, copyApprovedToClipboard } from '@/services/export'
import { RateLimitError, NetworkError } from '@/services/deepseek'
import { useGenerateVariations } from '@/hooks/useGenerateVariations'
import { CHANNEL_RULES } from '@/lib/channelRules'
import type { BriefingFormData, GenerationConfigData } from '@/schemas/briefing'
import type { Variation, VariationStatus } from '@/types'

export type Step = 'briefing' | 'config' | 'generating' | 'review'

export function useFlow() {
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

      const autoRejected = result.filter((v) => v.status === 'rejected').length
      const valid = result.length - autoRejected

      if (autoRejected > 0) {
        toast.warning(
          `${result.length} variações geradas. ${autoRejected} reprovadas por exceder limite de caracteres.`
        )
      } else {
        toast.success(`${valid} variações geradas com sucesso!`)
      }
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

  const channelRules = config ? CHANNEL_RULES[config.channel] : null

  const approvedCount = variations.filter((v) => v.status === 'approved').length
  const rejectedCount = variations.filter((v) => v.status === 'rejected').length
  const pendingCount = variations.filter((v) => v.status === 'pending').length

  return {
    // State
    step,
    briefing,
    config,
    variations,
    channelRules,
    generateMutation,

    // Counts
    counts: {
      totalCount: variations.length,
      approvedCount,
      rejectedCount,
      pendingCount,
    },

    // Handlers
    handlers: {
      onBriefingSubmit: handleBriefingSubmit,
      onConfigSubmit: handleConfigSubmit,
      onBackToBriefing: handleBackToBriefing,
      onBackToConfig: handleBackToConfig,
      onRetry: handleRetry,
      onNewGeneration: handleNewGeneration,
      onUpdateStatus: updateVariationStatus,
      onExportCSV: handleExportCSV,
      onCopyApproved: handleCopyApproved,
    },
  }
}
