'use client'
import {
  addToast,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Skeleton,
} from '@heroui/react'
import { useLocale } from 'next-intl'
import { useCallback, useEffect, useState } from 'react'

import { createClient } from '@/lib/supabase/client'

import PriceDisplay from '@/components/price-display'
import Typography from '@/components/ui/typography'

import { calcTotalCartItemsPrice, CartItemType } from '@/stores/use-cart-store'

import OrderSummaryItem from '@/elements/checkout/order-summary-card/order-summary-item'

import { IOrder } from '@/types/order'
import { IProduct } from '@/types/product'

interface OrderListCardProps {
  id?: string
}

interface OrderWithItems extends IOrder {
  order_items: CartItemType[]
  products: IProduct | null
}

export default function OrderListCard({ id }: OrderListCardProps) {
  const supabase = createClient()
  const locale = useLocale()

  const [order, setOrder] = useState<OrderWithItems | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFullOrderData = async () => {
      if (!id) return

      try {
        setLoading(true)
        // 3. KỸ THUẬT QUAN TRỌNG: Query lồng nhau (Join)
        const { data, error } = await supabase
          .from('orders')
          .select(
            `
              *,
              order_items (
                *,
                products (
                  base_price,
                  image_url,
                  product_translations (
                    name
                  )
                ),
                order_item_toppings (
                  toppings (
                    price,
                    topping_translations ( 
                      name
                    )
                  )
                )
              )
            `,
          )
          .eq('id', id)
          .eq('order_items.products.product_translations.locale', locale)
          .single()

        if (error) throw error

        if (data) {
          const cleanOrder = {
            ...data,
            order_items: data.order_items.map((item: any) => {
              const productName =
                item.products?.product_translations?.[0]?.name ||
                'Unknown Product'

              const toppingsList = item.order_item_toppings?.map((t: any) => ({
                name:
                  t.toppings?.topping_translations?.[0]?.name ||
                  'Unknown Topping',
                price: t.toppings?.price,
              }))

              const {
                // eslint-disable-next-line unused-imports/no-unused-vars
                products,
                // eslint-disable-next-line unused-imports/no-unused-vars
                product_id,
                // eslint-disable-next-line unused-imports/no-unused-vars
                order_item_toppings,
                // eslint-disable-next-line unused-imports/no-unused-vars
                order_id,
                ...rest
              } = item

              return {
                ...rest,
                product: {
                  base_price: item.products?.base_price,
                  image_url: item.products?.image_url,
                  name: productName,
                },
                toppings: toppingsList || [],
              }
            }),
          }

          setOrder(cleanOrder as OrderWithItems)
        }
      } catch (error: any) {
        addToast({
          title: 'Error',
          description: error.message || 'Failed to fetch order',
          color: 'danger',
        })
      } finally {
        setLoading(false)
      }
    }
    fetchFullOrderData()
  }, [id, supabase, locale])

  const renderOrderSummaryItems = useCallback(() => {
    if (loading) {
      return (
        <div className='space-y-3'>
          <Skeleton className='w-3/5 rounded-lg' isLoaded={loading}>
            <div className='h-3 w-full rounded-lg bg-default' />
          </Skeleton>
          <Skeleton className='w-4/5 rounded-lg' isLoaded={loading}>
            <div className='h-3 w-full rounded-lg bg-default-300' />
          </Skeleton>
          <Skeleton className='w-2/5 rounded-lg' isLoaded={loading}>
            <div className='h-3 w-full rounded-lg bg-default-200' />
          </Skeleton>
        </div>
      )
    }
    if (!Array.isArray(order?.order_items) || order?.order_items.length === 0)
      return null

    return (
      <div className='flex flex-col'>
        {order.order_items.map((cartItem) => (
          <OrderSummaryItem key={cartItem.id} {...cartItem} />
        ))}
        <Divider className='mt-5 mb-2' />
        <div className='flex justify-between'>
          <Typography>Subtotal</Typography>
          <Typography className='font-semibold'>
            <PriceDisplay
              value={calcTotalCartItemsPrice(order.order_items || [])}
            />
          </Typography>
        </div>
      </div>
    )
  }, [order?.order_items, loading])

  return (
    <Card
      className='lg:w-[360px] xl:w-sm'
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
        {loading ? (
          <div className='space-y-3'>
            <Skeleton className='w-3/5 rounded-lg' isLoaded={loading}>
              <div className='h-3 w-full rounded-lg bg-default' />
            </Skeleton>
            <Skeleton className='w-4/5 rounded-lg' isLoaded={loading}>
              <div className='h-3 w-full rounded-lg bg-default-300' />
            </Skeleton>
            <Skeleton className='w-2/5 rounded-lg' isLoaded={loading}>
              <div className='h-3 w-full rounded-lg bg-default-200' />
            </Skeleton>
          </div>
        ) : (
          <>
            {renderOrderSummaryItems()}
            <div className='mt-3 flex flex-col'>
              <Typography type='secondary'>Note:</Typography>
              <Typography
                type={!order?.note ? 'secondary' : 'default'}
                className={`font-medium ${!order?.note ? 'italic' : ''}`}
              >
                {order?.note || 'No note for this order'}
              </Typography>
            </div>
          </>
        )}
      </CardBody>
    </Card>
  )
}
