import { describe, it, expect } from 'vitest'
import { CHANNEL_RULES, getChannelRules, isWithinLimit, getCharCountStatus } from './channelRules'

describe('CHANNEL_RULES', () => {
  it('should have rules for google_ads', () => {
    expect(CHANNEL_RULES.google_ads).toBeDefined()
    expect(CHANNEL_RULES.google_ads.name).toBe('Google Ads')
    expect(CHANNEL_RULES.google_ads.headlineLimit).toBe(30)
    expect(CHANNEL_RULES.google_ads.descriptionLimit).toBe(90)
  })

  it('should have rules for meta_ads', () => {
    expect(CHANNEL_RULES.meta_ads).toBeDefined()
    expect(CHANNEL_RULES.meta_ads.name).toBe('Meta Ads')
    expect(CHANNEL_RULES.meta_ads.headlineLimit).toBe(40)
    expect(CHANNEL_RULES.meta_ads.descriptionLimit).toBe(125)
  })

  it('should have rules for linkedin_ads', () => {
    expect(CHANNEL_RULES.linkedin_ads).toBeDefined()
    expect(CHANNEL_RULES.linkedin_ads.name).toBe('LinkedIn Ads')
    expect(CHANNEL_RULES.linkedin_ads.headlineLimit).toBe(70)
    expect(CHANNEL_RULES.linkedin_ads.descriptionLimit).toBe(150)
  })
})

describe('getChannelRules', () => {
  it('should return correct rules for google_ads', () => {
    const rules = getChannelRules('google_ads')
    expect(rules.headlineLimit).toBe(30)
    expect(rules.descriptionLimit).toBe(90)
  })

  it('should return correct rules for meta_ads', () => {
    const rules = getChannelRules('meta_ads')
    expect(rules.headlineLimit).toBe(40)
    expect(rules.descriptionLimit).toBe(125)
  })

  it('should return correct rules for linkedin_ads', () => {
    const rules = getChannelRules('linkedin_ads')
    expect(rules.headlineLimit).toBe(70)
    expect(rules.descriptionLimit).toBe(150)
  })
})

describe('isWithinLimit', () => {
  it('should return true when text is under limit', () => {
    expect(isWithinLimit('Hello', 10)).toBe(true)
  })

  it('should return true when text is exactly at limit', () => {
    expect(isWithinLimit('Hello', 5)).toBe(true)
  })

  it('should return false when text exceeds limit', () => {
    expect(isWithinLimit('Hello World', 5)).toBe(false)
  })

  it('should handle empty string', () => {
    expect(isWithinLimit('', 10)).toBe(true)
  })

  it('should handle zero limit', () => {
    expect(isWithinLimit('', 0)).toBe(true)
    expect(isWithinLimit('a', 0)).toBe(false)
  })
})

describe('getCharCountStatus', () => {
  it('should return ok when under 90% of limit', () => {
    expect(getCharCountStatus(80, 100)).toBe('ok')
    expect(getCharCountStatus(89, 100)).toBe('ok')
  })

  it('should return warning when between 90% and 100% of limit', () => {
    expect(getCharCountStatus(90, 100)).toBe('warning')
    expect(getCharCountStatus(95, 100)).toBe('warning')
    expect(getCharCountStatus(100, 100)).toBe('warning')
  })

  it('should return error when over 100% of limit', () => {
    expect(getCharCountStatus(101, 100)).toBe('error')
    expect(getCharCountStatus(150, 100)).toBe('error')
  })

  it('should handle edge cases', () => {
    expect(getCharCountStatus(0, 100)).toBe('ok')
    expect(getCharCountStatus(27, 30)).toBe('warning') // 90% of 30
    expect(getCharCountStatus(26, 30)).toBe('ok') // under 90% of 30
  })
})
