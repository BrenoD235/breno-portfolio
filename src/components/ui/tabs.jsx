import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from '@/lib/utils'

const Tabs        = TabsPrimitive.Root
const TabsList    = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.List ref={ref}
    className={cn('inline-flex items-center w-full max-w-lg mx-auto bg-accent border border-border rounded-full p-1', className)}
    {...props} />
))
TabsList.displayName = 'TabsList'

const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger ref={ref}
    className={cn(
      'flex-1 px-5 py-2.5 rounded-full text-sm font-medium text-muted-foreground transition-all',
      'data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow',
      'hover:text-foreground',
      className
    )}
    {...props} />
))
TabsTrigger.displayName = 'TabsTrigger'

const TabsContent = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Content ref={ref}
    className={cn('mt-10 focus-visible:outline-none', className)}
    {...props} />
))
TabsContent.displayName = 'TabsContent'

export { Tabs, TabsList, TabsTrigger, TabsContent }
