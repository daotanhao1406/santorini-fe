'use client'
import { Chip } from '@heroui/react'

import Typography from '@/components/ui/typography'

import { ProductOptionsType, SWEETNESS_LEVEL } from '@/types/product'

export default function SweetnessLevelSelector({
  value,
  onChange,
}: {
  value: ProductOptionsType['sweetness_level']
  onChange: (value: ProductOptionsType['sweetness_level']) => void
}) {
  const sweetnessLevels = [
    SWEETNESS_LEVEL.NORMAL,
    SWEETNESS_LEVEL.SEVENTY,
    SWEETNESS_LEVEL.HALF,
  ]
  return (
    <div className='flex gap-3'>
      {sweetnessLevels.map((level, key) => (
        <Chip
          onClick={() => {
            if (typeof onChange === 'function') {
              onChange(level)
            }
          }}
          color={level === value ? 'primary' : 'default'}
          className={`cursor-pointer transition-colors duration-300 ${level !== value && 'hover:bg-default-200'}`}
          key={key}
        >
          <Typography size='sm'>{level}</Typography>
        </Chip>
      ))}
    </div>
  )
}
