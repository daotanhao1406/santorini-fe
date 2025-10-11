'use client'

import { cva, type VariantProps } from 'class-variance-authority'
import React, { type CSSProperties, useMemo } from 'react'

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
    weight: {
      default: 'font-bold',
      thin: 'font-thin',
      base: 'font-base',
      semi: 'font-semibold',
      bold: 'font-bold',
      black: 'font-black',
    },
    font: {
      default: 'font-sansTight',
      serif: 'font-serif',
      mono: 'font-mono',
    },
  },
  defaultVariants: {
    size: 'default',
    weight: 'bold',
    font: 'default',
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
  weight,
  font,
  className,
  fallbackColor = 'black',
}: TypographyProps) {
  const textClassName = useMemo(
    () => cn(textBaseVariants({ size, weight, font }), className),
    [size, weight, font, className],
  )

  // Memoize style for performance
  const textStyle = useMemo(() => {
    const style: CSSProperties = {
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      WebkitBackgroundClip: 'text',
      lineHeight: 1,
      textAlign: 'center',
      color: fallbackColor, // Always set the fallback color initially
      WebkitTextFillColor: fallbackColor, // Safari fix
    }

    return style
  }, [fallbackColor])

  return (
    <div className='relative inline-block'>
      <span className={textClassName} style={textStyle}>
        {children}
      </span>
    </div>
  )
}
