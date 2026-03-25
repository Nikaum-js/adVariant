import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/utils'
import { Badge } from './badge'

describe('Badge', () => {
  it('should render with children', () => {
    render(<Badge>Test Badge</Badge>)
    expect(screen.getByText('Test Badge')).toBeInTheDocument()
  })

  it('should apply default variant', () => {
    const { container } = render(<Badge>Default</Badge>)
    expect(container.firstChild).toHaveClass('bg-primary')
  })

  it('should apply secondary variant', () => {
    const { container } = render(<Badge variant="secondary">Secondary</Badge>)
    expect(container.firstChild).toHaveClass('bg-secondary')
  })

  it('should apply destructive variant', () => {
    const { container } = render(<Badge variant="destructive">Destructive</Badge>)
    expect(container.firstChild).toHaveClass('bg-destructive')
  })

  it('should apply outline variant', () => {
    const { container } = render(<Badge variant="outline">Outline</Badge>)
    expect(container.firstChild).toHaveClass('text-foreground')
  })

  it('should apply success variant', () => {
    const { container } = render(<Badge variant="success">Success</Badge>)
    expect(container.firstChild).toHaveClass('bg-success')
  })

  it('should apply success-muted variant', () => {
    const { container } = render(<Badge variant="success-muted">Success Muted</Badge>)
    expect(container.firstChild).toHaveClass('bg-success-muted')
  })

  it('should apply warning variant', () => {
    const { container } = render(<Badge variant="warning">Warning</Badge>)
    expect(container.firstChild).toHaveClass('bg-warning')
  })

  it('should apply custom className', () => {
    const { container } = render(<Badge className="custom-class">Custom</Badge>)
    expect(container.firstChild).toHaveClass('custom-class')
  })
})
