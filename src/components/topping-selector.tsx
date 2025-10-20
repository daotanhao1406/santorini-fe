'use client'

import { Checkbox, CheckboxGroup } from '@heroui/react'

import { ITopping } from '@/types/topping'

interface ToppingSelectorProps {
  name?: string
  toppings: ITopping[]
  value: string[]
  onChange: (value: string[]) => void
}

export default function ToppingSelector({
  name,
  toppings,
  value,
  onChange,
}: ToppingSelectorProps) {
  if (!Array.isArray(toppings) || toppings.length === 0) {
    return <div>There's no toppings to display</div>
  }

  return (
    <CheckboxGroup name={name} value={value} onValueChange={onChange}>
      <div className='grid grid-cols-2 gap-1'>
        {toppings.map((topping) => (
          <Checkbox key={topping.id} value={topping.id}>
            {topping.name}
          </Checkbox>
        ))}
      </div>
    </CheckboxGroup>
  )
}
