import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { Tone } from '@/types'
import { Zap, Sparkles, Target, Heart, Smile, Briefcase, type LucideIcon } from 'lucide-react'

interface ToneSelectorProps {
  value: Tone | undefined
  onChange: (tone: Tone) => void
}

interface ToneOption {
  value: Tone
  label: string
  description: string
  icon: LucideIcon
}

const TONES: ToneOption[] = [
  {
    value: 'urgent',
    label: 'Urgente / Escassez',
    description: 'Cria senso de urgência e ação imediata',
    icon: Zap,
  },
  {
    value: 'inspirational',
    label: 'Inspiracional / Aspiracional',
    description: 'Motiva e conecta com sonhos e objetivos',
    icon: Sparkles,
  },
  {
    value: 'direct',
    label: 'Direto / Objetivo',
    description: 'Vai direto ao ponto, sem rodeios',
    icon: Target,
  },
  {
    value: 'emotional',
    label: 'Emocional / Storytelling',
    description: 'Conecta através de histórias e emoções',
    icon: Heart,
  },
  {
    value: 'humorous',
    label: 'Humorístico / Descontraído',
    description: 'Leve e divertido, quebra barreiras',
    icon: Smile,
  },
  {
    value: 'professional',
    label: 'Profissional / Técnico',
    description: 'Sério e confiável, foco em dados',
    icon: Briefcase,
  },
]

export function ToneSelector({ value, onChange }: ToneSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Tom de Voz</h3>
        <p className="text-muted-foreground text-sm">
          Escolha o tom que melhor representa sua marca
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {TONES.map((tone) => {
          const isSelected = value === tone.value
          const Icon = tone.icon

          return (
            <Card
              key={tone.value}
              className={cn(
                'hover-lift press-scale cursor-pointer transition-all',
                isSelected
                  ? 'gradient-border-selected ring-primary/30 border-transparent ring-2'
                  : 'hover:border-primary/50'
              )}
              onClick={() => onChange(tone.value)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-lg transition-colors',
                      isSelected ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className={cn('font-medium', isSelected && 'text-primary')}>
                    {tone.label}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-xs">{tone.description}</CardDescription>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
