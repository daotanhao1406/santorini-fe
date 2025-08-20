import * as React from 'react'

import { cn } from '@/lib/utils'

export interface CoffeeInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode
}

const CoffeeInput = React.forwardRef<HTMLInputElement, CoffeeInputProps>(
  ({ className, type, icon, ...props }, ref) => {
    return (
      <div className='relative'>
        {icon && (
          <div className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground'>
            {icon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            'flex h-12 w-full rounded-xl border border-coffee-accent/20 bg-coffee-dark/90 px-3 py-2 text-coffee-light placeholder:text-coffee-light/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coffee-accent focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 backdrop-blur-sm',
            icon && 'pl-10',
            className,
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  },
)
CoffeeInput.displayName = 'CoffeeInput'

export { CoffeeInput }
