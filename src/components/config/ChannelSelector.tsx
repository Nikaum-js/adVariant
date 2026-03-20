import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Channel } from '@/types'
import { CHANNEL_RULES } from '@/lib/channelRules'

interface ChannelSelectorProps {
  value: Channel | undefined
  onChange: (channel: Channel) => void
}

const CHANNELS: { value: Channel; label: string; color: string }[] = [
  { value: 'google_ads', label: 'Google Ads', color: 'bg-blue-600' },
  { value: 'meta_ads', label: 'Meta Ads', color: 'bg-purple-600' },
  { value: 'linkedin_ads', label: 'LinkedIn Ads', color: 'bg-sky-600' },
]

export function ChannelSelector({ value, onChange }: ChannelSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Canal de Anúncio</h3>
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
                'hover:border-primary/50 cursor-pointer transition-all',
                isSelected && 'border-primary ring-primary/20 ring-2'
              )}
              onClick={() => onChange(channel.value)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Badge className={channel.color}>{channel.label}</Badge>
                  {isSelected && (
                    <Badge variant="outline" className="border-primary text-primary">
                      Selecionado
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-base">{rules.name}</CardTitle>
                <CardDescription className="mt-2 space-y-1">
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
