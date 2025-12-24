'use client'
import { Card, CardBody, CardFooter, CardHeader, Divider } from '@heroui/react'
import { useTranslations } from 'next-intl'
import { useCallback, useMemo } from 'react'

import PriceDisplay from '@/components/price-display'
import Typography from '@/components/ui/typography'

import { calcTotalCartItemsPrice, CartItemType } from '@/stores/use-cart-store'

import OrderSummaryItem from '@/elements/checkout/order-summary-card/order-summary-item'

interface OrderSummaryCardProps {
  checkoutItems?: CartItemType[]
  showOrderSummaryItems?: boolean
  renderCheckoutBtn?: React.ReactNode
  renderStepBackBtn?: React.ReactNode
}

export default function OrderSummaryCard(props: OrderSummaryCardProps) {
  const orderSummaryTranslations = useTranslations('checkout.order_summary')
  const shippingPrice = 15000

  const checkoutItems = useMemo(() => {
    if (!Array.isArray(props.checkoutItems)) return []
    return props.checkoutItems
  }, [props.checkoutItems])

  const subTotalPrice = calcTotalCartItemsPrice(checkoutItems)

  const renderOrderSummaryItems = useCallback(() => {
    if (!props.showOrderSummaryItems) return null
    if (!Array.isArray(checkoutItems) || checkoutItems.length === 0) return null

    return (
      <div className='flex flex-col gap-5'>
        {checkoutItems.map((cartItem) => (
          <OrderSummaryItem key={cartItem.id} {...cartItem} />
        ))}
        <Divider className='max-w-full mb-4' />
      </div>
    )
  }, [checkoutItems, props.showOrderSummaryItems])

  return (
    <Card
      classNames={{ base: 'bg-default-100 px-3 py-1.5 w-full' }}
      shadow='none'
    >
      <CardHeader className='font-semibold pb-1'>
        {orderSummaryTranslations('title')}
      </CardHeader>
      <CardBody>
        {renderOrderSummaryItems()}
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
        {props.renderCheckoutBtn}
        {props.renderStepBackBtn}
      </CardBody>
      <Divider className='max-w-[95%] mx-auto my-2' />
      <CardFooter className='justify-center'>
        <Typography>
          {orderSummaryTranslations('estimated_delivery_at')}{' '}
          <span className='font-semibold'>10:41 AM</span>
        </Typography>
      </CardFooter>
    </Card>
  )
}
