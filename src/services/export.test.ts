import { describe, it, expect, vi, beforeEach } from 'vitest'
import { copyApprovedToClipboard } from './export'
import type { Variation, Strategy } from '@/types'

// Mock XLSX
vi.mock('xlsx', () => ({
  utils: {
    json_to_sheet: vi.fn(() => ({})),
    book_new: vi.fn(() => ({})),
    book_append_sheet: vi.fn(),
  },
  writeFile: vi.fn(),
}))

const createVariation = (
  id: number,
  status: 'pending' | 'approved' | 'rejected',
  strategy: Strategy = 'social_proof'
): Variation => ({
  id,
  headline: `Headline ${id}`,
  description: `Description ${id}`,
  strategy,
  charCount: { headline: 10, description: 15 },
  status,
})

describe('copyApprovedToClipboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should copy approved variations to clipboard', () => {
    const variations: Variation[] = [
      createVariation(1, 'approved'),
      createVariation(2, 'rejected'),
      createVariation(3, 'approved'),
    ]

    const result = copyApprovedToClipboard(variations)

    expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1)
    expect(result).toContain('Headline 1')
    expect(result).toContain('Headline 3')
    expect(result).not.toContain('Headline 2')
  })

  it('should throw error when no approved variations', () => {
    const variations: Variation[] = [
      createVariation(1, 'pending'),
      createVariation(2, 'rejected'),
    ]

    expect(() => copyApprovedToClipboard(variations)).toThrow('Nenhuma variação aprovada para copiar')
  })

  it('should format output correctly', () => {
    const variations: Variation[] = [createVariation(1, 'approved', 'direct_benefit')]

    const result = copyApprovedToClipboard(variations)

    expect(result).toContain('--- Variação 1')
    expect(result).toContain('Benefício Direto')
    expect(result).toContain('Headline: Headline 1')
    expect(result).toContain('Descrição: Description 1')
  })

  it('should handle all strategy labels', () => {
    const strategies: { key: Strategy; label: string }[] = [
      { key: 'social_proof', label: 'Prova Social' },
      { key: 'direct_benefit', label: 'Benefício Direto' },
      { key: 'scarcity', label: 'Escassez' },
      { key: 'provocative_question', label: 'Pergunta Provocativa' },
      { key: 'authority', label: 'Autoridade' },
      { key: 'transformation', label: 'Transformação' },
    ]

    strategies.forEach(({ key, label }) => {
      const variations: Variation[] = [createVariation(1, 'approved', key)]
      const result = copyApprovedToClipboard(variations)
      expect(result).toContain(label)
    })
  })

  it('should number variations sequentially', () => {
    const variations: Variation[] = [
      createVariation(5, 'approved'),
      createVariation(10, 'approved'),
      createVariation(15, 'approved'),
    ]

    const result = copyApprovedToClipboard(variations)

    expect(result).toContain('Variação 1')
    expect(result).toContain('Variação 2')
    expect(result).toContain('Variação 3')
  })
})
