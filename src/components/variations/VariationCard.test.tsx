import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@/test/utils'
import userEvent from '@testing-library/user-event'
import { VariationCard } from './VariationCard'
import type { Variation, Strategy } from '@/types'

const createVariation = (overrides: Partial<Variation> = {}): Variation => ({
  id: 1,
  headline: 'Test Headline',
  description: 'Test Description',
  strategy: 'social_proof',
  charCount: { headline: 13, description: 16 },
  status: 'pending',
  ...overrides,
})

describe('VariationCard', () => {
  const defaultProps = {
    variation: createVariation(),
    headlineLimit: 30,
    descriptionLimit: 90,
    onApprove: vi.fn(),
    onReject: vi.fn(),
    onReset: vi.fn(),
  }

  it('should display headline and description', () => {
    render(<VariationCard {...defaultProps} />)
    expect(screen.getByText('Test Headline')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
  })

  it('should display strategy label', () => {
    render(<VariationCard {...defaultProps} />)
    expect(screen.getByText('Prova Social')).toBeInTheDocument()
  })

  it('should display Pendente badge for pending status', () => {
    render(<VariationCard {...defaultProps} />)
    expect(screen.getByText('Pendente')).toBeInTheDocument()
  })

  it('should display Aprovado badge for approved status', () => {
    render(<VariationCard {...defaultProps} variation={createVariation({ status: 'approved' })} />)
    expect(screen.getByText('Aprovado')).toBeInTheDocument()
  })

  it('should display Reprovado badge for rejected status', () => {
    render(<VariationCard {...defaultProps} variation={createVariation({ status: 'rejected' })} />)
    expect(screen.getByText('Reprovado')).toBeInTheDocument()
  })

  it('should show approve/reject buttons for pending status', () => {
    render(<VariationCard {...defaultProps} />)
    expect(screen.getByRole('button', { name: /aprovar/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /reprovar/i })).toBeInTheDocument()
  })

  it('should show reset button for approved status', () => {
    render(<VariationCard {...defaultProps} variation={createVariation({ status: 'approved' })} />)
    expect(screen.getByRole('button', { name: /voltar para pendente/i })).toBeInTheDocument()
  })

  it('should show reset button for rejected status', () => {
    render(<VariationCard {...defaultProps} variation={createVariation({ status: 'rejected' })} />)
    expect(screen.getByRole('button', { name: /voltar para pendente/i })).toBeInTheDocument()
  })

  it('should call onApprove when approve button is clicked', async () => {
    const onApprove = vi.fn()
    render(<VariationCard {...defaultProps} onApprove={onApprove} />)

    await userEvent.click(screen.getByRole('button', { name: /aprovar/i }))
    expect(onApprove).toHaveBeenCalledTimes(1)
  })

  it('should call onReject when reject button is clicked', async () => {
    const onReject = vi.fn()
    render(<VariationCard {...defaultProps} onReject={onReject} />)

    await userEvent.click(screen.getByRole('button', { name: /reprovar/i }))
    expect(onReject).toHaveBeenCalledTimes(1)
  })

  it('should call onReset when reset button is clicked', async () => {
    const onReset = vi.fn()
    render(
      <VariationCard
        {...defaultProps}
        onReset={onReset}
        variation={createVariation({ status: 'approved' })}
      />
    )

    await userEvent.click(screen.getByRole('button', { name: /voltar para pendente/i }))
    expect(onReset).toHaveBeenCalledTimes(1)
  })

  it('should display char counters', () => {
    render(<VariationCard {...defaultProps} />)
    expect(screen.getByText('13/30')).toBeInTheDocument()
    expect(screen.getByText('16/90')).toBeInTheDocument()
  })

  it('should handle all strategy types', () => {
    const strategies: { key: Strategy; label: string }[] = [
      { key: 'social_proof', label: 'Prova Social' },
      { key: 'direct_benefit', label: 'Benefício Direto' },
      { key: 'scarcity', label: 'Escassez' },
      { key: 'provocative_question', label: 'Pergunta Provocativa' },
      { key: 'authority', label: 'Autoridade' },
      { key: 'transformation', label: 'Transformação' },
    ]

    strategies.forEach(({ key, label }) => {
      const { unmount } = render(
        <VariationCard {...defaultProps} variation={createVariation({ strategy: key })} />
      )
      expect(screen.getByText(label)).toBeInTheDocument()
      unmount()
    })
  })
})
