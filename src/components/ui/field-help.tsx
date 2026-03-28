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
            'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background',
            className
          )}
        >
          <HelpCircle className="size-4" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-sm">
        <div className="space-y-2">
          <p className="font-medium">{title}</p>
          <p className="text-muted-foreground text-xs">{description}</p>
          {examples && examples.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-primary">Exemplos:</p>
              <ul className="text-muted-foreground list-inside list-disc text-xs">
                {examples.map((example, i) => (
                  <li key={i}>{example}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  )
}
