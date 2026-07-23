'use client'

import * as React from 'react'
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area'

import { cn } from '@/lib/utils'

type ScrollAreaProps = React.ComponentPropsWithRef<typeof ScrollAreaPrimitive.Root>
const ScrollArea = ({ ref, className, children, ...props }: ScrollAreaProps) => (
  <ScrollAreaPrimitive.Root ref={ref} className={cn('relative overflow-hidden', className)} {...props}>
    <ScrollAreaPrimitive.Viewport className='h-full w-full rounded-[inherit]'>{children}</ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
)

type ScrollbarProps = React.ComponentPropsWithRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
const ScrollBar = ({ ref, className, orientation = 'vertical', ...props }: ScrollbarProps) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      'flex touch-none transition-colors select-none',
      orientation === 'vertical' && 'h-full w-2.5 border-l border-l-transparent p-[1px]',
      orientation === 'horizontal' && 'h-2.5 flex-col border-t border-t-transparent p-[1px]',
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className='bg-border relative flex-1 rounded-full' />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
)
export type { ScrollAreaProps, ScrollbarProps }
export { ScrollArea, ScrollBar }
