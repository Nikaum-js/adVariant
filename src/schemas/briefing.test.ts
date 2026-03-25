import { describe, it, expect } from 'vitest'
import { briefingSchema, generationConfigSchema } from './briefing'

describe('briefingSchema', () => {
  const validBriefing = {
    product: 'Curso de marketing digital',
    targetAudience: 'Empreendedores de 25-45 anos',
    objective: 'conversion' as const,
    differentials: 'Único com mentoria individual',
    requiredKeywords: ['sucesso', 'resultados'],
    forbiddenWords: ['barato'],
  }

  it('should validate a complete valid briefing', () => {
    const result = briefingSchema.safeParse(validBriefing)
    expect(result.success).toBe(true)
  })

  it('should reject product with less than 3 characters', () => {
    const result = briefingSchema.safeParse({ ...validBriefing, product: 'ab' })
    expect(result.success).toBe(false)
  })

  it('should reject targetAudience with less than 3 characters', () => {
    const result = briefingSchema.safeParse({ ...validBriefing, targetAudience: 'ab' })
    expect(result.success).toBe(false)
  })

  it('should reject differentials with less than 3 characters', () => {
    const result = briefingSchema.safeParse({ ...validBriefing, differentials: 'ab' })
    expect(result.success).toBe(false)
  })

  it('should reject invalid objective', () => {
    const result = briefingSchema.safeParse({ ...validBriefing, objective: 'invalid' })
    expect(result.success).toBe(false)
  })

  it('should accept all valid objectives', () => {
    const objectives = ['awareness', 'leads', 'conversion', 'remarketing', 'launch'] as const
    objectives.forEach((objective) => {
      const result = briefingSchema.safeParse({ ...validBriefing, objective })
      expect(result.success).toBe(true)
    })
  })

  it('should accept empty requiredKeywords array', () => {
    const result = briefingSchema.safeParse({ ...validBriefing, requiredKeywords: [] })
    expect(result.success).toBe(true)
  })

  it('should accept empty forbiddenWords array', () => {
    const result = briefingSchema.safeParse({ ...validBriefing, forbiddenWords: [] })
    expect(result.success).toBe(true)
  })

  it('should reject missing required fields', () => {
    const result = briefingSchema.safeParse({})
    expect(result.success).toBe(false)
  })
})

describe('generationConfigSchema', () => {
  const validConfig = {
    channel: 'google_ads' as const,
    tone: 'urgent' as const,
    quantity: 10 as const,
  }

  it('should validate a complete valid config', () => {
    const result = generationConfigSchema.safeParse(validConfig)
    expect(result.success).toBe(true)
  })

  it('should accept all valid channels', () => {
    const channels = ['google_ads', 'meta_ads', 'linkedin_ads'] as const
    channels.forEach((channel) => {
      const result = generationConfigSchema.safeParse({ ...validConfig, channel })
      expect(result.success).toBe(true)
    })
  })

  it('should reject invalid channel', () => {
    const result = generationConfigSchema.safeParse({ ...validConfig, channel: 'tiktok_ads' })
    expect(result.success).toBe(false)
  })

  it('should accept all valid tones', () => {
    const tones = [
      'urgent',
      'inspirational',
      'direct',
      'emotional',
      'humorous',
      'professional',
    ] as const
    tones.forEach((tone) => {
      const result = generationConfigSchema.safeParse({ ...validConfig, tone })
      expect(result.success).toBe(true)
    })
  })

  it('should reject invalid tone', () => {
    const result = generationConfigSchema.safeParse({ ...validConfig, tone: 'aggressive' })
    expect(result.success).toBe(false)
  })

  it('should accept all valid quantities', () => {
    const quantities = [5, 10, 15, 20] as const
    quantities.forEach((quantity) => {
      const result = generationConfigSchema.safeParse({ ...validConfig, quantity })
      expect(result.success).toBe(true)
    })
  })

  it('should reject invalid quantity', () => {
    const result = generationConfigSchema.safeParse({ ...validConfig, quantity: 7 })
    expect(result.success).toBe(false)
  })

  it('should reject missing channel', () => {
    const { channel: _, ...configWithoutChannel } = validConfig
    const result = generationConfigSchema.safeParse(configWithoutChannel)
    expect(result.success).toBe(false)
  })

  it('should reject missing tone', () => {
    const { tone: _, ...configWithoutTone } = validConfig
    const result = generationConfigSchema.safeParse(configWithoutTone)
    expect(result.success).toBe(false)
  })

  it('should reject missing quantity', () => {
    const { quantity: _, ...configWithoutQuantity } = validConfig
    const result = generationConfigSchema.safeParse(configWithoutQuantity)
    expect(result.success).toBe(false)
  })
})
