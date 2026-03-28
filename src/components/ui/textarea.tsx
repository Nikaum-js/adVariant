import * as React from 'react'

import { cn } from '@/lib/utils'

export interface TextareaProps extends React.ComponentProps<'textarea'> {
  icon?: React.ReactNode
  error?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, icon, error, ...props }, ref) => {
    return (
      <div className="relative">
        {icon && (
          <div className="text-muted-foreground pointer-events-none absolute top-3 left-3">
            {icon}
          </div>
        )}
        <textarea
          className={cn(
            'border-border bg-input text-foreground flex min-h-[80px] w-full rounded-lg border px-3 py-2 text-base shadow-sm transition-colors',
            'placeholder:text-placeholder',
            'focus-visible:ring-ring focus-visible:border-ring focus-visible:ring-1 focus-visible:outline-none',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'md:text-sm',
            icon && 'pl-10',
            error && 'border-destructive focus-visible:ring-destructive',
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }
