export type Channel = 'google_ads' | 'meta_ads' | 'linkedin_ads'

export type Tone = 'urgent' | 'inspirational' | 'direct' | 'emotional' | 'humorous' | 'professional'

export type Strategy =
  | 'social_proof'
  | 'direct_benefit'
  | 'scarcity'
  | 'provocative_question'
  | 'authority'
  | 'transformation'

export type AppState = 'idle' | 'generating' | 'reviewing' | 'exporting' | 'error'

export type VariationStatus = 'pending' | 'approved' | 'rejected'

export interface Briefing {
  product: string
  targetAudience: string
  objective: string
  differentials: string
  requiredKeywords: string[]
  forbiddenWords: string[]
}

export interface ChannelRules {
  name: string
  headlineLimit: number
  descriptionLimit: number
}

export interface Variation {
  id: number
  headline: string
  description: string
  strategy: Strategy
  charCount: {
    headline: number
    description: number
  }
  status: VariationStatus
}

export interface GenerationConfig {
  channel: Channel
  tone: Tone
  quantity: 5 | 10 | 15 | 20
}
