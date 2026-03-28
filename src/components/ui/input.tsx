import * as React from 'react'

import { cn } from '@/lib/utils'

export interface InputProps extends React.ComponentProps<'input'> {
  icon?: React.ReactNode
  error?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, error, ...props }, ref) => {
    return (
      <div className="relative">
        {icon && (
          <div className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            'border-border bg-input text-foreground flex h-10 w-full rounded-lg border px-3 py-2 text-base shadow-sm transition-colors',
            'placeholder:text-placeholder',
            'file:text-foreground file:border-0 file:bg-transparent file:text-sm file:font-medium',
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
Input.displayName = 'Input'

export { Input }
