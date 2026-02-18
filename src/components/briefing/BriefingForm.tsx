import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { briefingSchema, type BriefingFormData } from '@/schemas/briefing'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowRight } from 'lucide-react'

interface BriefingFormProps {
  onSubmit: (data: BriefingFormData) => void
  initialData?: Partial<BriefingFormData>
}

const OBJECTIVES = [
  { value: 'awareness', label: 'Awareness (Reconhecimento de marca)' },
  { value: 'leads', label: 'Leads (Geração de contatos)' },
  { value: 'conversion', label: 'Conversão (Vendas diretas)' },
  { value: 'remarketing', label: 'Remarketing (Recuperação)' },
  { value: 'launch', label: 'Lançamento (Novo produto/serviço)' },
] as const

const parseCommaSeparated = (value: string): string[] => {
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

export function BriefingForm({ onSubmit, initialData }: BriefingFormProps) {
  const [keywordsInput, setKeywordsInput] = useState(
    initialData?.requiredKeywords?.join(', ') || ''
  )
  const [forbiddenInput, setForbiddenInput] = useState(
    initialData?.forbiddenWords?.join(', ') || ''
  )

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
    setValue,
  } = useForm<BriefingFormData>({
    resolver: zodResolver(briefingSchema),
    mode: 'onChange',
    defaultValues: {
      product: initialData?.product || '',
      targetAudience: initialData?.targetAudience || '',
      objective: initialData?.objective,
      differentials: initialData?.differentials || '',
      requiredKeywords: initialData?.requiredKeywords || [],
      forbiddenWords: initialData?.forbiddenWords || [],
    },
  })

  const handleKeywordsChange = (value: string) => {
    setKeywordsInput(value)
    setValue('requiredKeywords', parseCommaSeparated(value), { shouldValidate: true })
  }

  const handleForbiddenChange = (value: string) => {
    setForbiddenInput(value)
    setValue('forbiddenWords', parseCommaSeparated(value), { shouldValidate: true })
  }

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Briefing do Anúncio</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="product">Produto/Serviço *</Label>
            <Textarea
              id="product"
              placeholder="Descreva o produto ou serviço que será anunciado..."
              {...register('product')}
              className={errors.product ? 'border-red-500' : ''}
              rows={3}
            />
            {errors.product && <p className="text-sm text-red-500">{errors.product.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetAudience">Público-alvo *</Label>
            <Textarea
              id="targetAudience"
              placeholder="Quem é o público-alvo? (idade, interesses, comportamento...)"
              {...register('targetAudience')}
              className={errors.targetAudience ? 'border-red-500' : ''}
              rows={3}
            />
            {errors.targetAudience && (
              <p className="text-sm text-red-500">{errors.targetAudience.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="objective">Objetivo da Campanha *</Label>
            <Controller
              name="objective"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className={errors.objective ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Selecione o objetivo" />
                  </SelectTrigger>
                  <SelectContent>
                    {OBJECTIVES.map((obj) => (
                      <SelectItem key={obj.value} value={obj.value}>
                        {obj.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.objective && <p className="text-sm text-red-500">{errors.objective.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="differentials">Diferenciais *</Label>
            <Textarea
              id="differentials"
              placeholder="O que diferencia este produto/serviço da concorrência?"
              {...register('differentials')}
              className={errors.differentials ? 'border-red-500' : ''}
              rows={3}
            />
            {errors.differentials && (
              <p className="text-sm text-red-500">{errors.differentials.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="requiredKeywords">Palavras-chave obrigatórias</Label>
            <Input
              id="requiredKeywords"
              placeholder="Separe por vírgula: palavra1, palavra2, palavra3"
              value={keywordsInput}
              onChange={(e) => handleKeywordsChange(e.target.value)}
            />
            <p className="text-muted-foreground text-sm">
              Palavras que devem aparecer nas copies geradas
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="forbiddenWords">Palavras proibidas</Label>
            <Input
              id="forbiddenWords"
              placeholder="Separe por vírgula: palavra1, palavra2, palavra3"
              value={forbiddenInput}
              onChange={(e) => handleForbiddenChange(e.target.value)}
            />
            <p className="text-muted-foreground text-sm">
              Palavras que NÃO devem aparecer nas copies geradas
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={!isValid}>
            Próximo
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
