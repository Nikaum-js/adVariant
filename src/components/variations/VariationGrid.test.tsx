import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@/test/utils'
import userEvent from '@testing-library/user-event'
import { VariationGrid } from './VariationGrid'
import type { Variation } from '@/types'

const createVariation = (id: number, status: 'pending' | 'approved' | 'rejected'): Variation => ({
  id,
  headline: `Headline ${id}`,
  description: `Description ${id}`,
  strategy: 'social_proof',
  charCount: { headline: 10, description: 15 },
  status,
})

describe('VariationGrid', () => {
  const variations: Variation[] = [
    createVariation(1, 'pending'),
    createVariation(2, 'approved'),
    createVariation(3, 'rejected'),
    createVariation(4, 'pending'),
  ]

  const defaultProps = {
    variations,
    headlineLimit: 30,
    descriptionLimit: 90,
    onUpdateStatus: vi.fn(),
  }

  it('should render all variations by default', () => {
    render(<VariationGrid {...defaultProps} />)
    expect(screen.getByText('Headline 1')).toBeInTheDocument()
    expect(screen.getByText('Headline 2')).toBeInTheDocument()
    expect(screen.getByText('Headline 3')).toBeInTheDocument()
    expect(screen.getByText('Headline 4')).toBeInTheDocument()
  })

  it('should display filter buttons', () => {
    render(<VariationGrid {...defaultProps} />)
    expect(screen.getByRole('button', { name: /todas/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /pendentes/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /aprovadas/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /reprovadas/i })).toBeInTheDocument()
  })

  it('should filter by pending when clicking Pendentes', async () => {
    render(<VariationGrid {...defaultProps} />)

    await userEvent.click(screen.getByRole('button', { name: /pendentes/i }))

    expect(screen.getByText('Headline 1')).toBeInTheDocument()
    expect(screen.getByText('Headline 4')).toBeInTheDocument()
    expect(screen.queryByText('Headline 2')).not.toBeInTheDocument()
    expect(screen.queryByText('Headline 3')).not.toBeInTheDocument()
  })

  it('should filter by approved when clicking Aprovadas', async () => {
    render(<VariationGrid {...defaultProps} />)

    await userEvent.click(screen.getByRole('button', { name: /aprovadas/i }))

    expect(screen.getByText('Headline 2')).toBeInTheDocument()
    expect(screen.queryByText('Headline 1')).not.toBeInTheDocument()
    expect(screen.queryByText('Headline 3')).not.toBeInTheDocument()
    expect(screen.queryByText('Headline 4')).not.toBeInTheDocument()
  })

  it('should filter by rejected when clicking Reprovadas', async () => {
    render(<VariationGrid {...defaultProps} />)

    await userEvent.click(screen.getByRole('button', { name: /reprovadas/i }))

    expect(screen.getByText('Headline 3')).toBeInTheDocument()
    expect(screen.queryByText('Headline 1')).not.toBeInTheDocument()
    expect(screen.queryByText('Headline 2')).not.toBeInTheDocument()
    expect(screen.queryByText('Headline 4')).not.toBeInTheDocument()
  })

  it('should show all variations when clicking Todas', async () => {
    render(<VariationGrid {...defaultProps} />)

    await userEvent.click(screen.getByRole('button', { name: /aprovadas/i }))
    await userEvent.click(screen.getByRole('button', { name: /todas/i }))

    expect(screen.getByText('Headline 1')).toBeInTheDocument()
    expect(screen.getByText('Headline 2')).toBeInTheDocument()
    expect(screen.getByText('Headline 3')).toBeInTheDocument()
    expect(screen.getByText('Headline 4')).toBeInTheDocument()
  })

  it('should call onUpdateStatus when approving a variation', async () => {
    const onUpdateStatus = vi.fn()
    render(<VariationGrid {...defaultProps} onUpdateStatus={onUpdateStatus} />)

    const approveButtons = screen.getAllByRole('button', { name: /aprovar/i })
    await userEvent.click(approveButtons[0])

    expect(onUpdateStatus).toHaveBeenCalledWith(1, 'approved')
  })

  it('should call onUpdateStatus when rejecting a variation', async () => {
    const onUpdateStatus = vi.fn()
    render(<VariationGrid {...defaultProps} onUpdateStatus={onUpdateStatus} />)

    const rejectButtons = screen.getAllByRole('button', { name: /reprovar/i })
    await userEvent.click(rejectButtons[0])

    expect(onUpdateStatus).toHaveBeenCalledWith(1, 'rejected')
  })

  it('should show empty message when no variations match filter', async () => {
    const emptyVariations: Variation[] = [createVariation(1, 'pending')]
    render(<VariationGrid {...defaultProps} variations={emptyVariations} />)

    await userEvent.click(screen.getByRole('button', { name: /aprovadas/i }))

    expect(
      screen.getByText('Nenhuma variação encontrada com o filtro selecionado.')
    ).toBeInTheDocument()
  })

  it('should display correct counts in filter badges', () => {
    render(<VariationGrid {...defaultProps} />)

    // Total: 4, Pending: 2, Approved: 1, Rejected: 1
    expect(screen.getByText('4')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getAllByText('1')).toHaveLength(2) // Both approved and rejected have 1
  })
})
