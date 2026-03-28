import { Toaster as Sonner } from 'sonner'

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:glass-card group-[.toaster]:text-foreground group-[.toaster]:border-glass-border group-[.toaster]:shadow-xl',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
          success: 'group-[.toaster]:border-success/30 group-[.toaster]:text-success',
          error: 'group-[.toaster]:border-destructive/30 group-[.toaster]:text-destructive',
          info: 'group-[.toaster]:border-info/30 group-[.toaster]:text-info',
          warning: 'group-[.toaster]:border-warning/30 group-[.toaster]:text-warning',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
