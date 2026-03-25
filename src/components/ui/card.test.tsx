import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/utils'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './card'

describe('Card', () => {
  it('should render with children', () => {
    render(<Card>Card Content</Card>)
    expect(screen.getByText('Card Content')).toBeInTheDocument()
  })

  it('should apply default variant', () => {
    const { container } = render(<Card>Default</Card>)
    expect(container.firstChild).toHaveClass('bg-card')
  })

  it('should apply glass variant', () => {
    const { container } = render(<Card variant="glass">Glass</Card>)
    expect(container.firstChild).toHaveClass('glass-card')
  })

  it('should apply custom className', () => {
    const { container } = render(<Card className="custom-class">Custom</Card>)
    expect(container.firstChild).toHaveClass('custom-class')
  })
})

describe('CardHeader', () => {
  it('should render with children', () => {
    render(<CardHeader>Header Content</CardHeader>)
    expect(screen.getByText('Header Content')).toBeInTheDocument()
  })
})

describe('CardTitle', () => {
  it('should render with children', () => {
    render(<CardTitle>Title</CardTitle>)
    expect(screen.getByText('Title')).toBeInTheDocument()
  })

  it('should apply font-semibold class', () => {
    const { container } = render(<CardTitle>Title</CardTitle>)
    expect(container.firstChild).toHaveClass('font-semibold')
  })
})

describe('CardDescription', () => {
  it('should render with children', () => {
    render(<CardDescription>Description</CardDescription>)
    expect(screen.getByText('Description')).toBeInTheDocument()
  })
})

describe('CardContent', () => {
  it('should render with children', () => {
    render(<CardContent>Content</CardContent>)
    expect(screen.getByText('Content')).toBeInTheDocument()
  })
})
