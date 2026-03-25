import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@/test/utils'
import userEvent from '@testing-library/user-event'
import { QuantitySelector } from './QuantitySelector'

describe('QuantitySelector', () => {
  const defaultProps = {
    value: undefined,
    onChange: vi.fn(),
  }

  it('should render all quantity options', () => {
    render(<QuantitySelector {...defaultProps} />)
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByText('15')).toBeInTheDocument()
    expect(screen.getByText('20')).toBeInTheDocument()
  })

  it('should display descriptions for quantities', () => {
    render(<QuantitySelector {...defaultProps} />)
    expect(screen.getByText('Teste rápido')).toBeInTheDocument()
    expect(screen.getByText('Recomendado')).toBeInTheDocument()
    expect(screen.getByText('Mais opções')).toBeInTheDocument()
    expect(screen.getByText('Máximo')).toBeInTheDocument()
  })

  it('should call onChange with 5 when clicking 5', async () => {
    const onChange = vi.fn()
    render(<QuantitySelector {...defaultProps} onChange={onChange} />)

    await userEvent.click(screen.getByText('5'))
    expect(onChange).toHaveBeenCalledWith(5)
  })

  it('should call onChange with 10 when clicking 10', async () => {
    const onChange = vi.fn()
    render(<QuantitySelector {...defaultProps} onChange={onChange} />)

    await userEvent.click(screen.getByText('10'))
    expect(onChange).toHaveBeenCalledWith(10)
  })

  it('should call onChange with 15 when clicking 15', async () => {
    const onChange = vi.fn()
    render(<QuantitySelector {...defaultProps} onChange={onChange} />)

    await userEvent.click(screen.getByText('15'))
    expect(onChange).toHaveBeenCalledWith(15)
  })

  it('should call onChange with 20 when clicking 20', async () => {
    const onChange = vi.fn()
    render(<QuantitySelector {...defaultProps} onChange={onChange} />)

    await userEvent.click(screen.getByText('20'))
    expect(onChange).toHaveBeenCalledWith(20)
  })

  it('should display title and description', () => {
    render(<QuantitySelector {...defaultProps} />)
    expect(screen.getByText('Quantidade de Variações')).toBeInTheDocument()
    expect(screen.getByText('Quantas variações de copy deseja gerar?')).toBeInTheDocument()
  })
})
