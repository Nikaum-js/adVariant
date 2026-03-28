import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Channel } from '@/types'
import { CHANNEL_RULES } from '@/lib/channelRules'

interface ChannelSelectorProps {
  value: Channel | undefined
  onChange: (channel: Channel) => void
}

const CHANNELS: { value: Channel; label: string; icon: string }[] = [
  { value: 'google_ads', label: 'Google Ads', icon: 'G' },
  { value: 'meta_ads', label: 'Meta Ads', icon: 'M' },
  { value: 'linkedin_ads', label: 'LinkedIn Ads', icon: 'in' },
]

export function ChannelSelector({ value, onChange }: ChannelSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Canal de Anúncio</h3>
        <p className="text-muted-foreground text-sm">
          Selecione o canal para gerar copies otimizadas
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {CHANNELS.map((channel) => {
          const rules = CHANNEL_RULES[channel.value]
          const isSelected = value === channel.value

          return (
            <Card
              key={channel.value}
              className={cn(
                'hover-lift press-scale cursor-pointer transition-all',
                isSelected
                  ? 'gradient-border-selected ring-primary/30 border-transparent ring-2'
                  : 'hover:border-primary/50'
              )}
              onClick={() => onChange(channel.value)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold',
                        channel.value === 'google_ads' && 'bg-blue-500/20 text-blue-400',
                        channel.value === 'meta_ads' && 'bg-purple-500/20 text-purple-400',
                        channel.value === 'linkedin_ads' && 'bg-sky-500/20 text-sky-400'
                      )}
                    >
                      {channel.icon}
                    </div>
                    <CardTitle className="text-base">{channel.label}</CardTitle>
                  </div>
                  {isSelected && (
                    <Badge variant="success-muted" className="text-xs">
                      Selecionado
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="space-y-1 text-xs">
                  <p>Headline: até {rules.headlineLimit} caracteres</p>
                  <p>Descrição: até {rules.descriptionLimit} caracteres</p>
                </CardDescription>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
