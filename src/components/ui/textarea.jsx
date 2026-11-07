import * as React from 'react'
import { cn } from '@/lib/utils'

const Textarea = React.forwardRef(({ className, ...props }, ref) => (
  <textarea ref={ref}
    className={cn(
      'flex min-h-[100px] w-full rounded-lg border border-border bg-accent/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-foreground/30 disabled:cursor-not-allowed disabled:opacity-50 resize-vertical',
      className
    )}
    {...props} />
))
Textarea.displayName = 'Textarea'
export { Textarea }
