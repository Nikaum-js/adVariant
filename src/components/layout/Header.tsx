import { StepIndicator } from '@/components/ui/step-indicator'

type Step = 'briefing' | 'config' | 'generating' | 'review'

interface HeaderProps {
  currentStep: Step
  hasVariations: boolean
}

export function Header({ currentStep, hasVariations }: HeaderProps) {
  return (
    <div className="border-border/50 bg-background/50 border-b backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <StepIndicator
          steps={[
            {
              number: 1,
              label: 'Briefing',
              isActive: currentStep === 'briefing',
              isCompleted: currentStep !== 'briefing',
            },
            {
              number: 2,
              label: 'Configuração',
              isActive: currentStep === 'config',
              isCompleted: currentStep === 'generating' || currentStep === 'review',
            },
            {
              number: 3,
              label: 'Revisão',
              isActive: currentStep === 'generating' || currentStep === 'review',
              isCompleted: currentStep === 'review' && hasVariations,
            },
          ]}
        />
      </div>
    </div>
  )
}
