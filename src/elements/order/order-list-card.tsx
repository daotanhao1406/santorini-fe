'use client'
import { Card, CardBody, CardHeader, Divider } from '@heroui/react'
import { useCallback } from 'react'

import PriceDisplay from '@/components/price-display'
import Typography from '@/components/ui/typography'

import { calcTotalCartItemsPrice, CartItemType } from '@/stores/use-cart-store'

import OrderSummaryItem from '@/elements/checkout/order-summary-card/order-summary-item'

interface OrderListCardProps {
  orderItems?: CartItemType[]
}

export default function OrderListCard({ orderItems }: OrderListCardProps) {
  const renderOrderSummaryItems = useCallback(() => {
    if (!Array.isArray(orderItems) || orderItems.length === 0) return null

    return (
      <div className='flex flex-col gap-5'>
        {orderItems.map((cartItem) => (
          <OrderSummaryItem key={cartItem.id} {...cartItem} />
        ))}
        <Divider />
      </div>
    )
  }, [orderItems])
  return (
    <Card
      className='w-sm'
      classNames={{
        base: 'bg-transparent px-3 py-1.5 w-full border-2 border-primary-700',
      }}
      shadow='none'
    >
      <CardHeader className='font-semibold pb-1 flex flex-col items-start'>
        Your Order
        <Divider className='my-2' />
      </CardHeader>

      <CardBody>
        {renderOrderSummaryItems()}
        <div className='flex justify-between mt-2'>
          <Typography>Subtotal</Typography>
          <Typography className='font-semibold'>
            <PriceDisplay value={calcTotalCartItemsPrice(orderItems || [])} />
          </Typography>
        </div>
        <div className='mt-3 flex flex-col'>
          <Typography type='secondary'>Note:</Typography>
          <Typography className='font-medium'>
            I need it urgently to give to my friend for her birthday in the next
            3days, hope the shop will hekp me deliver it as soon as possible.
            Thanks a lot.
          </Typography>
        </div>
      </CardBody>
    </Card>
  )
}
