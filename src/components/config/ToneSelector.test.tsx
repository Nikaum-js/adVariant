import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@/test/utils'
import userEvent from '@testing-library/user-event'
import { ToneSelector } from './ToneSelector'

describe('ToneSelector', () => {
  const defaultProps = {
    value: undefined,
    onChange: vi.fn(),
  }

  it('should render all tone options', () => {
    render(<ToneSelector {...defaultProps} />)
    expect(screen.getByText('Urgente / Escassez')).toBeInTheDocument()
    expect(screen.getByText('Inspiracional / Aspiracional')).toBeInTheDocument()
    expect(screen.getByText('Direto / Objetivo')).toBeInTheDocument()
    expect(screen.getByText('Emocional / Storytelling')).toBeInTheDocument()
    expect(screen.getByText('Humorístico / Descontraído')).toBeInTheDocument()
    expect(screen.getByText('Profissional / Técnico')).toBeInTheDocument()
  })

  it('should display descriptions for tones', () => {
    render(<ToneSelector {...defaultProps} />)
    expect(screen.getByText('Cria senso de urgência e ação imediata')).toBeInTheDocument()
    expect(screen.getByText('Motiva e conecta com sonhos e objetivos')).toBeInTheDocument()
    expect(screen.getByText('Vai direto ao ponto, sem rodeios')).toBeInTheDocument()
  })

  it('should call onChange when clicking on a tone', async () => {
    const onChange = vi.fn()
    render(<ToneSelector {...defaultProps} onChange={onChange} />)

    await userEvent.click(screen.getByText('Urgente / Escassez'))
    expect(onChange).toHaveBeenCalledWith('urgent')
  })

  it('should call onChange with correct tone values', async () => {
    const onChange = vi.fn()
    render(<ToneSelector {...defaultProps} onChange={onChange} />)

    await userEvent.click(screen.getByText('Inspiracional / Aspiracional'))
    expect(onChange).toHaveBeenCalledWith('inspirational')

    await userEvent.click(screen.getByText('Direto / Objetivo'))
    expect(onChange).toHaveBeenCalledWith('direct')

    await userEvent.click(screen.getByText('Emocional / Storytelling'))
    expect(onChange).toHaveBeenCalledWith('emotional')

    await userEvent.click(screen.getByText('Humorístico / Descontraído'))
    expect(onChange).toHaveBeenCalledWith('humorous')

    await userEvent.click(screen.getByText('Profissional / Técnico'))
    expect(onChange).toHaveBeenCalledWith('professional')
  })

  it('should display title and description', () => {
    render(<ToneSelector {...defaultProps} />)
    expect(screen.getByText('Tom de Voz')).toBeInTheDocument()
    expect(screen.getByText('Escolha o tom que melhor representa sua marca')).toBeInTheDocument()
  })
})
