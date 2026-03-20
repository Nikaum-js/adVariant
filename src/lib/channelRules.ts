import type { Channel, ChannelRules } from '@/types'

export const CHANNEL_RULES: Record<Channel, ChannelRules> = {
  google_ads: {
    name: 'Google Ads',
    headlineLimit: 30,
    descriptionLimit: 90,
  },
  meta_ads: {
    name: 'Meta Ads',
    headlineLimit: 40,
    descriptionLimit: 125,
  },
  linkedin_ads: {
    name: 'LinkedIn Ads',
    headlineLimit: 70,
    descriptionLimit: 150,
  },
}

export function getChannelRules(channel: Channel): ChannelRules {
  return CHANNEL_RULES[channel]
}

export function isWithinLimit(text: string, limit: number): boolean {
  return text.length <= limit
}

export function getCharCountStatus(current: number, limit: number): 'ok' | 'warning' | 'error' {
  const percentage = (current / limit) * 100
  if (percentage > 100) return 'error'
  if (percentage >= 90) return 'warning'
  return 'ok'
}
