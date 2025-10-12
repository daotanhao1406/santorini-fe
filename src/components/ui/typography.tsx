'use client'

import { cva, type VariantProps } from 'class-variance-authority'
import React, { useMemo } from 'react'

import { cn } from '@/lib/utils'

// Define text style variants
const textBaseVariants = cva('', {
  variants: {
    size: {
      xxs: 'text-[8px] sm:text-[10px] lg:text-[10px]',
      xs: 'text-[10px] sm:text-xs lg:text-xs',
      sm: 'text-xs sm:text-sm lg:text-sm',
      default: 'text-xs sm:text-sm lg:text-sm',
      md: 'text-sm sm:text-base lg:text-base',
      lg: 'text-base sm:text-lg lg:text-lg',
      xl: 'text-lg sm:text-xl lg:text-2xl',
      xxl: 'text-xl sm:text-2xl lg:text-3xl',
      xll: 'text-2xl sm:text-3xl lg:text-4xl',
      xxxl: 'text-3xl sm:text-4xl lg:text-5xl',
    },
    type: {
      default: '',
      primary: 'text-primary-600',
      secondary: 'text-default-700',
      success: 'text-success-600',
      danger: 'text-danger-600',
      warning: 'text-warning-600',
    },
  },

  defaultVariants: {
    size: 'default',
    type: 'default',
  },
})

interface TypographyProps extends VariantProps<typeof textBaseVariants> {
  children: React.ReactNode
  className?: string
  fallbackColor?: string
  transitionDuration?: number
}

export default function Typography({
  children,
  size,
  type,
  className,
}: TypographyProps) {
  const textClassName = useMemo(
    () => cn(textBaseVariants({ size, type }), className),
    [size, type, className],
  )

  return <span className={textClassName}>{children}</span>
}
