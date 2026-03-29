import { HelpCircle } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

interface FieldHelpProps {
  title: string
  description: string
  examples?: string[]
  className?: string
}

export function FieldHelp({ title, description, examples, className }: FieldHelpProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className={cn(
            'text-muted-foreground hover:text-foreground inline-flex items-center justify-center rounded-full transition-colors',
            'focus:ring-ring focus:ring-offset-background focus:ring-2 focus:ring-offset-2 focus:outline-none',
            className
          )}
        >
          <HelpCircle className="size-4" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs p-0">
        <div className="space-y-3 p-3">
          {/* Title */}
          <p className="text-sm leading-tight font-semibold">{title}</p>

          {/* Description */}
          <p className="text-muted-foreground text-[13px] leading-relaxed">{description}</p>

          {/* Examples */}
          {examples && examples.length > 0 && (
            <div className="border-border/50 space-y-2 border-t pt-3">
              <p className="text-primary/80 text-xs font-medium tracking-wide uppercase">
                Exemplos
              </p>
              <ul className="space-y-1.5">
                {examples.map((example, i) => (
                  <li
                    key={i}
                    className="text-foreground/80 flex items-start gap-2 text-[13px] leading-snug"
                  >
                    <span className="bg-primary/60 mt-1.5 size-1 shrink-0 rounded-full" />
                    <span>{example}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  )
}
