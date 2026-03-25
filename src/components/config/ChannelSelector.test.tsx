import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@/test/utils'
import userEvent from '@testing-library/user-event'
import { ChannelSelector } from './ChannelSelector'

describe('ChannelSelector', () => {
  const defaultProps = {
    value: undefined,
    onChange: vi.fn(),
  }

  it('should render all channel options', () => {
    render(<ChannelSelector {...defaultProps} />)
    expect(screen.getByText('Google Ads')).toBeInTheDocument()
    expect(screen.getByText('Meta Ads')).toBeInTheDocument()
    expect(screen.getByText('LinkedIn Ads')).toBeInTheDocument()
  })

  it('should display character limits for Google Ads', () => {
    render(<ChannelSelector {...defaultProps} />)
    expect(screen.getByText('Headline: até 30 caracteres')).toBeInTheDocument()
    expect(screen.getByText('Descrição: até 90 caracteres')).toBeInTheDocument()
  })

  it('should display character limits for Meta Ads', () => {
    render(<ChannelSelector {...defaultProps} />)
    expect(screen.getByText('Headline: até 40 caracteres')).toBeInTheDocument()
    expect(screen.getByText('Descrição: até 125 caracteres')).toBeInTheDocument()
  })

  it('should display character limits for LinkedIn Ads', () => {
    render(<ChannelSelector {...defaultProps} />)
    expect(screen.getByText('Headline: até 70 caracteres')).toBeInTheDocument()
    expect(screen.getByText('Descrição: até 150 caracteres')).toBeInTheDocument()
  })

  it('should call onChange when clicking on a channel', async () => {
    const onChange = vi.fn()
    render(<ChannelSelector {...defaultProps} onChange={onChange} />)

    await userEvent.click(screen.getByText('Google Ads'))
    expect(onChange).toHaveBeenCalledWith('google_ads')
  })

  it('should call onChange with meta_ads when clicking Meta Ads', async () => {
    const onChange = vi.fn()
    render(<ChannelSelector {...defaultProps} onChange={onChange} />)

    await userEvent.click(screen.getByText('Meta Ads'))
    expect(onChange).toHaveBeenCalledWith('meta_ads')
  })

  it('should call onChange with linkedin_ads when clicking LinkedIn Ads', async () => {
    const onChange = vi.fn()
    render(<ChannelSelector {...defaultProps} onChange={onChange} />)

    await userEvent.click(screen.getByText('LinkedIn Ads'))
    expect(onChange).toHaveBeenCalledWith('linkedin_ads')
  })

  it('should show Selecionado badge when channel is selected', () => {
    render(<ChannelSelector {...defaultProps} value="google_ads" />)
    expect(screen.getByText('Selecionado')).toBeInTheDocument()
  })

  it('should display title and description', () => {
    render(<ChannelSelector {...defaultProps} />)
    expect(screen.getByText('Canal de Anúncio')).toBeInTheDocument()
    expect(screen.getByText('Selecione o canal para gerar copies otimizadas')).toBeInTheDocument()
  })
})
