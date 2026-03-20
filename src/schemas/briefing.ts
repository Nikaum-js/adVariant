import { z } from 'zod'

export const briefingSchema = z.object({
  product: z.string().min(3, 'Descreva o produto/serviço (mínimo 3 caracteres)'),
  targetAudience: z.string().min(3, 'Descreva o público-alvo (mínimo 3 caracteres)'),
  objective: z.enum(['awareness', 'leads', 'conversion', 'remarketing', 'launch'], {
    error: 'Selecione um objetivo',
  }),
  differentials: z.string().min(3, 'Liste os diferenciais (mínimo 3 caracteres)'),
  requiredKeywords: z.array(z.string()),
  forbiddenWords: z.array(z.string()),
})

export type BriefingFormData = z.infer<typeof briefingSchema>

export const generationConfigSchema = z.object({
  channel: z.enum(['google_ads', 'meta_ads', 'linkedin_ads'], {
    error: 'Selecione um canal',
  }),
  tone: z.enum(['urgent', 'inspirational', 'direct', 'emotional', 'humorous', 'professional'], {
    error: 'Selecione um tom de voz',
  }),
  quantity: z.union([z.literal(5), z.literal(10), z.literal(15), z.literal(20)], {
    error: 'Selecione a quantidade de variações',
  }),
})

export type GenerationConfigData = z.infer<typeof generationConfigSchema>
