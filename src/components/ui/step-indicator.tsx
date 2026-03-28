import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Step {
  number: number
  label: string
  isActive: boolean
  isCompleted: boolean
}

interface StepIndicatorProps {
  steps: Step[]
}

export function StepIndicator({ steps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-0">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <StepCircle step={step} />
          {index < steps.length - 1 && (
            <StepConnector isCompleted={steps[index + 1].isActive || steps[index + 1].isCompleted} />
          )}
        </div>
      ))}
    </div>
  )
}

function StepCircle({ step }: { step: Step }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <motion.div
        className={cn(
          'relative flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold transition-all',
          step.isCompleted && 'from-primary to-accent bg-gradient-to-br text-white shadow-lg shadow-primary/25',
          step.isActive && !step.isCompleted && 'bg-primary text-primary-foreground shadow-lg shadow-primary/30',
          !step.isActive && !step.isCompleted && 'bg-muted text-muted-foreground'
        )}
        initial={false}
        animate={{
          scale: step.isActive ? 1.1 : 1,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {/* Pulse ring for active step */}
        {step.isActive && !step.isCompleted && (
          <motion.div
            className="bg-primary/30 absolute inset-0 rounded-full"
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
          />
        )}

        {/* Content */}
        {step.isCompleted ? (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <Check className="h-6 w-6" strokeWidth={3} />
          </motion.div>
        ) : (
          <span>{step.number}</span>
        )}
      </motion.div>

      <motion.span
        className={cn(
          'text-xs font-medium transition-colors',
          step.isActive || step.isCompleted ? 'text-foreground' : 'text-muted-foreground'
        )}
        animate={{ opacity: step.isActive ? 1 : 0.7 }}
      >
        {step.label}
      </motion.span>
    </div>
  )
}

function StepConnector({ isCompleted }: { isCompleted: boolean }) {
  return (
    <div className="relative mx-2 h-1 w-16 overflow-hidden rounded-full bg-muted sm:mx-4 sm:w-24">
      <motion.div
        className="from-primary to-accent absolute inset-y-0 left-0 bg-gradient-to-r"
        initial={{ width: '0%' }}
        animate={{ width: isCompleted ? '100%' : '0%' }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      />
    </div>
  )
}
