'use client'

import { Button } from '@heroui/react'
import { Minus, Plus } from 'lucide-react'

import Counter from '@/components/counter'
import Typography from '@/components/ui/typography'

export default function QuantityStepper({
  value,
  onChange,
}: {
  value: number
  onChange: (value: number) => void
}) {
  return (
    <div className='flex items-center justify-center gap-2'>
      <Button size='sm' isIconOnly onPress={() => onChange(value - 1)}>
        <Minus size={14} />
      </Button>
      <Typography className='mt-1'>
        <Counter value={value} />
      </Typography>
      <Button size='sm' isIconOnly onPress={() => onChange(value + 1)}>
        <Plus size={14} />
      </Button>
    </div>
  )
}
