import { cn } from '@/lib/utils'

export function Badge({ className, ...props }) {
  return (
    <span
      className={cn('inline-flex items-center rounded border border-border bg-accent px-2.5 py-0.5 font-mono text-xs font-medium text-muted-foreground', className)}
      {...props}
    />
  )
}
