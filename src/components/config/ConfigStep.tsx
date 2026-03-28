import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { ChannelSelector } from './ChannelSelector'
import { ToneSelector } from './ToneSelector'
import { QuantitySelector } from './QuantitySelector'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { generationConfigSchema, type GenerationConfigData } from '@/schemas/briefing'

interface ConfigStepProps {
  onSubmit: (config: GenerationConfigData) => void
  onBack: () => void
  initialData?: Partial<GenerationConfigData>
}

export function ConfigStep({ onSubmit, onBack, initialData }: ConfigStepProps) {
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<GenerationConfigData>({
    resolver: zodResolver(generationConfigSchema),
    mode: 'onChange',
    defaultValues: {
      channel: initialData?.channel,
      tone: initialData?.tone,
      quantity: initialData?.quantity,
    },
  })

  return (
    <Card variant="glass" className="mx-auto w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="text-xl">Configuração da Geração</CardTitle>
        <CardDescription>Escolha o canal, tom de voz e quantidade de variações</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-10">
          <Controller
            name="channel"
            control={control}
            render={({ field }) => (
              <ChannelSelector value={field.value} onChange={field.onChange} />
            )}
          />
          <Controller
            name="tone"
            control={control}
            render={({ field }) => <ToneSelector value={field.value} onChange={field.onChange} />}
          />
          <Controller
            name="quantity"
            control={control}
            render={({ field }) => (
              <QuantitySelector value={field.value} onChange={field.onChange} />
            )}
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <Button type="submit" variant="gradient" disabled={!isValid}>
            <Sparkles className="mr-2 h-4 w-4" />
            Gerar Variações
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
