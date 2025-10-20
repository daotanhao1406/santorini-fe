'use client'

import React from 'react'

import SizeItem from '@/components/size-item'

import { IconSvgProps } from '@/types'
import { ProductOptionsType, SIZE } from '@/types/product'

interface SizeSelectorProps {
  value: ProductOptionsType['size']
  onChange: (value: ProductOptionsType['size']) => void
}

export const SizeXLIcon = ({ size, width, height }: IconSvgProps) => {
  return (
    <svg
      width={size || width || 25}
      height={size || height || 38}
      viewBox='0 0 25 38'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M5.88192 37.6949H19.4769C19.804 37.6949 20.1202 37.577 20.3674 37.3628C20.6146 37.1485 20.7763 36.8523 20.8228 36.5285L23.4306 8.99169H24.5224C24.7701 8.99169 24.9709 8.79089 24.9709 8.5432V6.72122C24.9709 6.47353 24.7701 6.27273 24.5224 6.27273H23.0921L21.8595 3.8621V1.17469C21.8595 0.904918 21.623 0.696193 21.3553 0.729667L5.23439 2.74554C5.11481 2.76049 5.00627 2.82294 4.93325 2.91882L2.37882 6.27273H0.94849C0.700796 6.27273 0.5 6.47353 0.5 6.72122V8.5432C0.5 8.79089 0.700796 8.99169 0.94849 8.99169H2.04031L4.53602 36.5285C4.58247 36.8523 4.74414 37.1485 4.99136 37.3628C5.23858 37.577 5.55477 37.6949 5.88192 37.6949ZM20.1012 13.0701H5.36971L4.78649 8.99169H20.6831L20.1012 13.0701ZM7.0606 34.9759L6.53344 21.227H18.9361L18.2968 34.9759H7.0606Z'
        fill='currentColor'
      />
    </svg>
  )
}

export const SizeLIcon = ({ size, width, height }: IconSvgProps) => {
  return (
    <svg
      width={size || width || 25}
      height={size || height || 33}
      viewBox='0 0 25 33'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M5.88192 32.2057H19.4769C19.804 32.2057 20.1202 32.0878 20.3674 31.8736C20.6146 31.6593 20.7763 31.3631 20.8228 31.0393L23.4306 8.49175H24.5224C24.7701 8.49175 24.9709 8.29095 24.9709 8.04325V6.22126C24.9709 5.97357 24.7701 5.77277 24.5224 5.77277H23.0921L21.8595 3.36212V0.674694C21.8595 0.404919 21.623 0.196194 21.3553 0.229668L5.2344 2.24555C5.11481 2.26051 5.00627 2.32296 4.93325 2.41884L2.37882 5.77277H0.948492C0.700796 5.77277 0.5 5.97357 0.5 6.22126V8.04325C0.5 8.29095 0.700797 8.49175 0.948492 8.49175H2.04031L4.53602 31.0393C4.58247 31.3631 4.74414 31.6593 4.99136 31.8736C5.23858 32.0878 5.55477 32.2057 5.88192 32.2057ZM20.1012 12.5702H5.36971L4.78649 8.49175H20.6831L20.1012 12.5702ZM7.0606 29.4867L6.53344 20.7271H18.9361L18.2968 29.4867H7.0606Z'
        fill='currentColor'
      />
    </svg>
  )
}

export const SizeMIcon = ({ size, width, height }: IconSvgProps) => {
  return (
    <svg
      width={size || width || 25}
      height={size || height || 29}
      viewBox='0 0 25 29'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M5.93798 28.0244H19.5329C19.8601 28.0245 20.1763 27.9065 20.4235 27.6923C20.6707 27.478 20.8324 27.1818 20.8788 26.858L23.4306 8.99169H24.5224C24.7701 8.99169 24.9709 8.7909 24.9709 8.5432V6.72123C24.9709 6.47353 24.7701 6.27273 24.5224 6.27273H23.0921L21.8595 3.8621V1.17469C21.8595 0.904917 21.623 0.696193 21.3553 0.729667L5.23439 2.74554C5.11481 2.76049 5.00627 2.82295 4.93325 2.91882L2.37882 6.27273H0.94849C0.700796 6.27273 0.5 6.47353 0.5 6.72122V8.5432C0.5 8.7909 0.700796 8.99169 0.948491 8.99169H2.04031L4.59208 26.858C4.63853 27.1818 4.8002 27.478 5.04742 27.6923C5.29464 27.9065 5.61083 28.0245 5.93798 28.0244ZM20.1012 13.0701H5.36971L4.78649 8.99169H20.6831L20.1012 13.0701ZM7.11666 25.3055L6.53344 21.227H18.9361L18.3529 25.3055H7.11666Z'
        fill='currentColor'
      />
    </svg>
  )
}

export default function SizeSelector({
  value = SIZE.M,
  onChange,
}: SizeSelectorProps) {
  const sizes = [
    {
      name: SIZE.M,
      icon: <SizeMIcon />,
    },
    {
      name: SIZE.L,
      icon: <SizeLIcon />,
    },
    {
      name: SIZE.XL,
      icon: <SizeXLIcon />,
    },
  ]

  return (
    <div className='flex gap-6 w-full'>
      {sizes.map((size, key) => (
        <SizeItem
          key={key}
          name={`Size ${size.name}`}
          icon={size.icon}
          isSelected={value === size.name}
          onClick={() => {
            if (typeof onChange === 'function') {
              onChange(size.name)
            }
          }}
          className='h-20 w-18 items-center justify-end'
        />
      ))}
    </div>
  )
}
