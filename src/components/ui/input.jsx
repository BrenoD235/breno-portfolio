import * as React from 'react'
import { cn } from '@/lib/utils'

const Input = React.forwardRef(({ className, type, ...props }, ref) => (
  <input type={type} ref={ref}
    className={cn(
      'flex h-11 w-full rounded-lg border border-border bg-accent/50 px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-foreground/30 disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
    {...props} />
))
Input.displayName = 'Input'
export { Input }
