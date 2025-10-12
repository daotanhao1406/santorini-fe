'use client'
import { Badge } from '@heroui/react'
import { Pencil, X } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

import { useIsMobile } from '@/hooks/use-media-query'

import QuantityStepper from '@/components/layout/cart-sidebar/cart-item/quantity-stepper'
import PriceDisplay from '@/components/price-display'
import Typography from '@/components/ui/typography'

import { Product } from '@/types/product'

export default function CartItem({ name, image_url, base_price }: Product) {
  const [quantity, setQuantity] = useState<number>(1)
  const isMobile = useIsMobile()
  return (
    <div className='group flex gap-3 md:gap-4 justify-center relative'>
      <Badge
        className='cursor-pointer lg:opacity-0 group-hover:opacity-100 transition-opacity duration-200'
        isOneChar
        color='danger'
        content={<X />}
        placement='top-left'
        size={isMobile ? 'sm' : 'md'}
      >
        <div className='relative h-16 sm:h-20 aspect-[7/8]'>
          <Image
            alt='Cart image'
            className='object-cover rounded-xl'
            src={image_url}
            fill
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          />
        </div>
      </Badge>

      <div className='flex justify-between flex-1'>
        <div className='flex flex-col'>
          <Typography className='font-semibold -mt-1' size='md'>
            {name}
          </Typography>
          <Typography type='secondary'>100% sugar</Typography>
          <Typography type='secondary'>Full ice</Typography>
          <Typography
            className='font-semibold flex items-center gap-1 cursor-pointer'
            type='primary'
          >
            <Pencil size={12} />
            Edit
          </Typography>
        </div>
        <div className='flex flex-col justify-between items-end font-semibold'>
          <Typography size='sm' className='font-semibold text-foreground/60'>
            <PriceDisplay value={base_price * quantity} />
          </Typography>
          <QuantityStepper value={quantity} onChange={setQuantity} min={1} />
        </div>
      </div>
    </div>
  )
}
