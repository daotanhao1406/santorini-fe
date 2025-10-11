'use client'
import Image from 'next/image'
import { useState } from 'react'

import QuantityStepper from '@/components/layout/cart-sidebar/cart-item/quantity-stepper'
import Typography from '@/components/ui/typography'

import { Product } from '@/types/product'

export default function CartItem({ name, image_url, base_price }: Product) {
  const [quantity, setQuantity] = useState<number>(1)
  return (
    <div className='flex gap-6 md:gap-4 justify-center'>
      <div className='relative h-16 sm:h-20 aspect-[7/8]'>
        <Image
          alt='Cart image'
          className='object-cover rounded-xl'
          src={image_url}
          fill
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
        />
      </div>

      <div className='flex flex-col flex-1'>
        <div className='flex justify-between gap-1'>
          {/* <h1 className='text-large font-semibold'>{name}</h1> */}
          <Typography size='md'>{name}</Typography>
          <span className='text-xs text-foreground/60'>
            {typeof base_price === 'number' && (
              <p className='font-bold'>{base_price?.toLocaleString('en-US')}</p>
            )}
          </span>
        </div>
        <div>
          <QuantityStepper value={quantity} onChange={setQuantity} />
        </div>
      </div>
    </div>
  )
}
