import { AlertCircle, RefreshCw, WifiOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface ErrorStateProps {
  title: string
  description: string
  icon?: 'alert' | 'wifi'
  actionLabel?: string
  onAction?: () => void
  secondaryActionLabel?: string
  onSecondaryAction?: () => void
}

export function ErrorState({
  title,
  description,
  icon = 'alert',
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
}: ErrorStateProps) {
  const Icon = icon === 'wifi' ? WifiOff : AlertCircle

  return (
    <Card className="border-destructive/50 mx-auto max-w-md">
      <CardHeader>
        <div className="flex items-center justify-center gap-2">
          <Icon className="text-destructive h-6 w-6" />
          <CardTitle className="text-destructive">{title}</CardTitle>
        </div>
        <CardDescription className="text-center">{description}</CardDescription>
      </CardHeader>
      {(onAction || onSecondaryAction) && (
        <CardContent className="flex justify-center gap-4">
          {onSecondaryAction && secondaryActionLabel && (
            <Button variant="outline" onClick={onSecondaryAction}>
              {secondaryActionLabel}
            </Button>
          )}
          {onAction && actionLabel && (
            <Button onClick={onAction}>
              <RefreshCw className="mr-2 h-4 w-4" />
              {actionLabel}
            </Button>
          )}
        </CardContent>
      )}
    </Card>
  )
}
