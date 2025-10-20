'use client'

import { Button } from '@heroui/react'
import { Minus, Plus } from 'lucide-react'

import Counter from '@/components/counter'
import Typography from '@/components/ui/typography'

export default function QuantityStepper({
  value,
  onIncrease,
  onDecrease,
  min,
  max,
}: {
  value: number
  onIncrease: () => void
  onDecrease: () => void
  min?: number
  max?: number
}) {
  return (
    <div className='flex items-center justify-center gap-2'>
      <Button
        isDisabled={typeof min === 'number' && value <= min}
        size='sm'
        isIconOnly
        onPress={onDecrease}
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
        onPress={onIncrease}
      >
        <Plus size={14} />
      </Button>
    </div>
  )
}
