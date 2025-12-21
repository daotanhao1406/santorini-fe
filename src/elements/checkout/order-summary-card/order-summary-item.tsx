'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'

import PriceDisplay from '@/components/price-display'
import Typography from '@/components/ui/typography'

import { CartItemType } from '@/stores/use-cart-store'
import { useProductOptionStore } from '@/stores/use-product-option-store'

export default function OrderSummaryItem(cartItem: CartItemType) {
  const toppings = useProductOptionStore((s) => s.toppings)
  const iceTranslations = useTranslations('menu.ice')

  return (
    <div className='group flex gap-3 md:gap-4 justify-center relative'>
      <div className='relative hidden lg:block lg:h-14 aspect-[7/8]'>
        <Image
          alt='Cart image'
          className='object-cover rounded-lg'
          src={cartItem.product.image_url}
          fill
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
        />
      </div>

      <div className='flex flex-col justify-between flex-1'>
        <div className='flex items-center justify-between w-full flex-1'>
          <Typography className='font-semibold'>
            {cartItem.product.name}
          </Typography>
          <div className='flex items-start gap-1'>
            <Typography className='font-semibold'>
              <PriceDisplay value={cartItem.product.base_price} />
            </Typography>
            <Typography
              className='font-semibold mt-0.75'
              size='xs'
              type='secondary'
            >
              x {cartItem.quantity}
            </Typography>
          </div>
        </div>
        <div className='flex items-center gap-2 mt-1'>
          <Typography size='sm'>{cartItem.size}</Typography>
          <Typography className='text-default-600' size='xxs'>
            ●
          </Typography>
          <Typography size='sm'>{cartItem.sweetness_level} sugar</Typography>
          <Typography className='text-default-600' size='xxs'>
            ●
          </Typography>
          <Typography size='sm'>
            {iceTranslations(cartItem.ice_level?.toString())}
          </Typography>
        </div>
        <div className='flex flex-col mt-1'>
          {cartItem.toppings.length > 0 &&
            cartItem.toppings.map((topping, key) => {
              const toppingData = toppings.find((t) => t.id === topping)
              return (
                <Typography key={key} size='sm'>
                  {toppingData?.name}
                </Typography>
              )
            })}
        </div>
        <Typography size='sm' type='secondary'>
          {cartItem.note}
        </Typography>
      </div>
    </div>
  )
}
