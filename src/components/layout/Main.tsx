import { BriefingForm } from '@/components/briefing/BriefingForm'
import { ConfigStep } from '@/components/config/ConfigStep'
import { GenerationError } from '@/components/generation/GenerationError'
import { ReviewHeader } from '@/components/review/ReviewHeader'
import { VariationGrid } from '@/components/variations/VariationGrid'
import { LoadingScreen } from '@/components/ui/loading-screen'
import type { Step } from '@/hooks/useFlow'
import type { BriefingFormData, GenerationConfigData } from '@/schemas/briefing'
import type { Variation, VariationStatus, ChannelRules } from '@/types'

interface MainProps {
  step: Step
  briefing: BriefingFormData | null
  config: GenerationConfigData | null
  variations: Variation[]
  channelRules: ChannelRules | null
  counts: {
    totalCount: number
    approvedCount: number
    rejectedCount: number
    pendingCount: number
  }
  generateMutation: {
    isPending: boolean
    isError: boolean
    error: Error | null
  }
  handlers: {
    onBriefingSubmit: (data: BriefingFormData) => void
    onConfigSubmit: (data: GenerationConfigData) => void
    onBackToBriefing: () => void
    onBackToConfig: () => void
    onRetry: () => void
    onNewGeneration: () => void
    onUpdateStatus: (id: number, status: VariationStatus) => void
    onExportCSV: () => void
    onCopyApproved: () => void
  }
}

export function Main({
  step,
  briefing,
  config,
  variations,
  channelRules,
  counts,
  generateMutation,
  handlers,
}: MainProps) {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      {step === 'briefing' && (
        <div className="animate-in">
          <BriefingForm onSubmit={handlers.onBriefingSubmit} initialData={briefing || undefined} />
        </div>
      )}

      {step === 'config' && (
        <div className="animate-in">
          <ConfigStep
            onSubmit={handlers.onConfigSubmit}
            onBack={handlers.onBackToBriefing}
            initialData={config || undefined}
          />
        </div>
      )}

      {step === 'generating' && (
        <div className="animate-in">
          {generateMutation.isPending ? (
            <LoadingScreen />
          ) : generateMutation.isError ? (
            <GenerationError
              error={generateMutation.error}
              onBack={handlers.onBackToConfig}
              onRetry={handlers.onRetry}
            />
          ) : null}
        </div>
      )}

      {step === 'review' && variations.length > 0 && channelRules && (
        <div className="animate-in space-y-6">
          <ReviewHeader
            {...counts}
            onExportCSV={handlers.onExportCSV}
            onCopyApproved={handlers.onCopyApproved}
            onNewGeneration={handlers.onNewGeneration}
          />
          <VariationGrid
            variations={variations}
            headlineLimit={channelRules.headlineLimit}
            descriptionLimit={channelRules.descriptionLimit}
            onUpdateStatus={handlers.onUpdateStatus}
          />
        </div>
      )}
    </main>
  )
}
