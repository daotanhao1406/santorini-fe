'use client'

import { Button } from '@heroui/react'
import { Minus, Plus } from 'lucide-react'

import Counter from '@/components/counter'
import Typography from '@/components/ui/typography'

export default function QuantityStepper({
  value,
  onChange,
  min,
  max,
}: {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
}) {
  return (
    <div className='flex items-center justify-center gap-2'>
      <Button
        isDisabled={typeof min === 'number' && value <= min}
        size='sm'
        isIconOnly
        onPress={() => onChange(value - 1)}
      >
        <Minus size={14} />
      </Button>
      <Typography>
        <Counter value={value} />
      </Typography>
      <Button
        isDisabled={typeof max === 'number' && value >= max}
        size='sm'
        isIconOnly
        onPress={() => onChange(value + 1)}
      >
        <Plus size={14} />
      </Button>
    </div>
  )
}
