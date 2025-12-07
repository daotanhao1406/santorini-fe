'use client'
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
} from '@heroui/react'

import PriceDisplay from '@/components/price-display'
import Typography from '@/components/ui/typography'

import { calcTotalCartItemsPrice, useCartStore } from '@/stores/use-cart-store'
import { useTranslations } from 'next-intl'

export default function OrderSummaryCard() {
  const orderSummaryTranslations = useTranslations('checkout.order_summary')
  const cartItems = useCartStore((state) => state.items)
  const subTotalPrice = calcTotalCartItemsPrice(cartItems)
  const shippingPrice = 15000
  return (
    <Card
      classNames={{ base: 'bg-default-100 px-3 py-1.5 w-full md:w-84' }}
      shadow='none'
    >
      <CardHeader className='font-semibold pb-1'>{orderSummaryTranslations('title')}</CardHeader>
      <CardBody>
        <div className='flex justify-between'>
          <div className='flex flex-col gap-2.5'>
            <Typography>{orderSummaryTranslations('subtotal')}</Typography>
            <Typography>{orderSummaryTranslations('discount')}</Typography>
            <Typography>{orderSummaryTranslations('shipping')}</Typography>
            <Typography>{orderSummaryTranslations('total')}</Typography>
          </div>
          <div className='flex flex-col items-end gap-2.5'>
            <Typography className='font-semibold'>
              <PriceDisplay value={subTotalPrice} />
            </Typography>
            <Typography className='font-semibold'>
              <PriceDisplay value={shippingPrice} />
            </Typography>
            <Typography type='primary' className='font-semibold'>
              {orderSummaryTranslations('free')}
            </Typography>
            <Typography className='font-semibold'>
              <PriceDisplay value={subTotalPrice + shippingPrice} />
            </Typography>
          </div>
        </div>
        <Button color='primary' radius='full' className='font-medium mt-6'>
          {orderSummaryTranslations('proceed_to_checkout_btn')}
        </Button>
      </CardBody>
      <Divider className='max-w-[95%] mx-auto my-2' />
      <CardFooter className='justify-center'>
        <Typography>
          {orderSummaryTranslations('estimated_delivery_at')} <span className='font-semibold'>10:41 AM</span>
        </Typography>
      </CardFooter>
    </Card>
  )
}
