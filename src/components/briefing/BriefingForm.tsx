import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { briefingSchema, type BriefingFormData } from '@/schemas/briefing'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FormField } from '@/components/ui/form-field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowRight, Package, Users, Target, Sparkles, Tag, Ban } from 'lucide-react'

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
    <Card variant="glass" className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-xl">Briefing do Anúncio</CardTitle>
        <CardDescription>Preencha as informações sobre o produto e público-alvo</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            label="Produto/Serviço"
            htmlFor="product"
            required
            error={errors.product?.message}
          >
            <Textarea
              id="product"
              icon={<Package className="size-4" />}
              placeholder="Descreva o produto ou serviço que será anunciado..."
              error={!!errors.product}
              rows={3}
              {...register('product')}
            />
          </FormField>

          <FormField
            label="Público-alvo"
            htmlFor="targetAudience"
            required
            error={errors.targetAudience?.message}
          >
            <Textarea
              id="targetAudience"
              icon={<Users className="size-4" />}
              placeholder="Quem é o público-alvo? (idade, interesses, comportamento...)"
              error={!!errors.targetAudience}
              rows={3}
              {...register('targetAudience')}
            />
          </FormField>

          <FormField
            label="Objetivo da Campanha"
            htmlFor="objective"
            required
            error={errors.objective?.message}
          >
            <Controller
              name="objective"
              control={control}
              render={({ field }) => (
                <div className="relative">
                  <div className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 z-10 -translate-y-1/2">
                    <Target className="size-4" />
                  </div>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      className={`pl-10 ${errors.objective ? 'border-destructive' : ''}`}
                    >
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
                </div>
              )}
            />
          </FormField>

          <FormField
            label="Diferenciais"
            htmlFor="differentials"
            required
            error={errors.differentials?.message}
          >
            <Textarea
              id="differentials"
              icon={<Sparkles className="size-4" />}
              placeholder="O que diferencia este produto/serviço da concorrência?"
              error={!!errors.differentials}
              rows={3}
              {...register('differentials')}
            />
          </FormField>

          <FormField
            label="Palavras-chave obrigatórias"
            htmlFor="requiredKeywords"
            hint="Palavras que devem aparecer nas copies geradas"
          >
            <Input
              id="requiredKeywords"
              icon={<Tag className="size-4" />}
              placeholder="Separe por vírgula: palavra1, palavra2, palavra3"
              value={keywordsInput}
              onChange={(e) => handleKeywordsChange(e.target.value)}
            />
          </FormField>

          <FormField
            label="Palavras proibidas"
            htmlFor="forbiddenWords"
            hint="Palavras que NÃO devem aparecer nas copies geradas"
          >
            <Input
              id="forbiddenWords"
              icon={<Ban className="size-4" />}
              placeholder="Separe por vírgula: palavra1, palavra2, palavra3"
              value={forbiddenInput}
              onChange={(e) => handleForbiddenChange(e.target.value)}
            />
          </FormField>

          <Button type="submit" variant="gradient" className="w-full" size="lg" disabled={!isValid}>
            Próximo
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
