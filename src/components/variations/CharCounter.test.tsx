import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/utils'
import { CharCounter } from './CharCounter'

describe('CharCounter', () => {
  it('should display current/limit format', () => {
    render(<CharCounter current={25} limit={30} />)
    expect(screen.getByText('25/30')).toBeInTheDocument()
  })

  it('should have success color when under 90%', () => {
    const { container } = render(<CharCounter current={26} limit={30} />)
    expect(container.firstChild).toHaveClass('text-success')
  })

  it('should have warning color when between 90% and 100%', () => {
    const { container } = render(<CharCounter current={27} limit={30} />)
    expect(container.firstChild).toHaveClass('text-warning')
  })

  it('should have warning color when exactly at limit', () => {
    const { container } = render(<CharCounter current={30} limit={30} />)
    expect(container.firstChild).toHaveClass('text-warning')
  })

  it('should have destructive color when over limit', () => {
    const { container } = render(<CharCounter current={35} limit={30} />)
    expect(container.firstChild).toHaveClass('text-destructive')
  })

  it('should apply custom className', () => {
    const { container } = render(<CharCounter current={10} limit={30} className="custom-class" />)
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('should handle zero current', () => {
    render(<CharCounter current={0} limit={30} />)
    expect(screen.getByText('0/30')).toBeInTheDocument()
  })
})
