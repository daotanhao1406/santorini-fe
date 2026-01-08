'use client'
import { addToast, Button, Divider, Skeleton } from '@heroui/react'
import { use, useEffect, useState } from 'react'

import { createClient } from '@/lib/supabase/client'
import { getShortUUID } from '@/lib/utils'

import Typography from '@/components/ui/typography'

import DeliveryInformation from '@/elements/order/delivery-information'
import OrderListCard from '@/elements/order/order-list-card'
import OrderStatusStepper from '@/elements/order/order-status-stepper'
import PaymentDetails from '@/elements/order/payment-details'
import { getOrderById } from '@/services/order.service'

import { IOrder } from '@/types/order'

export default function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const supabase = createClient()

  const [orderData, setOrderData] = useState<IOrder | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchOrderData = async () => {
      setLoading(true)
      try {
        const { data, error } = await getOrderById(id)

        if (error) {
          addToast({
            title: 'Fetch order error',
            description: error.message,
            color: 'danger',
          })
        }
        setOrderData(data)
      } catch {
        addToast({
          title: 'Fetch order error',
          color: 'danger',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchOrderData()
  }, [id, supabase])

  return (
    <div className='md:m-8 m-4 flex flex-col flex-1'>
      <div className='flex items-end justify-between'>
        <Typography
          className='text-start font-medium font-playfair'
          size='xxxl'
        >
          Order Details
        </Typography>
        <Typography className='text-end font-semibold'>
          Order ID: #{getShortUUID(id)}
        </Typography>
      </div>
      <Divider className='my-6' />
      <div className='flex w-full gap-12'>
        {/* left section */}
        <OrderListCard id={id} />

        {/* right section */}
        <div className='flex flex-col flex-1'>
          {/* order status */}
          <OrderStatusStepper id={id} />
          <Divider className='mt-6 mb-10' />

          {/* actions section */}
          <div className='flex justify-between gap-4'>
            <div className='flex flex-col gap-2'>
              <Typography className='font-medium'>
                Delivery attempt should be made by 05-01-2023
              </Typography>
              <Typography size='sm' type='secondary'>
                Confirm order receive after you received the goods successfully
              </Typography>
            </div>
            <div className='flex flex-col gap-3'>
              <Button size='lg' color='primary'>
                Cancel Order
              </Button>
              <Button size='lg'>Chat with customer support</Button>
            </div>
          </div>

          {/* dashed divider */}
          <div className='w-full flex gap-3 overflow-hidden my-10'>
            {Array.from({ length: 16 }).map((_, i) => (
              <div
                key={i}
                className={`h-0.5 flex-1 rounded-full ${i % 2 === 0 ? 'bg-sky-300' : 'bg-rose-300'}`}
              />
            ))}
          </div>

          {/* delivery information */}
          <div className='flex gap-10'>
            <div className='flex flex-col gap-4 w-1/2'>
              <Typography className='font-semibold' size='lg'>
                Delivery Address
              </Typography>
              {loading ? (
                <div className='space-y-3'>
                  <Skeleton className='w-3/5 rounded-lg'>
                    <div className='h-3 w-3/5 rounded-lg bg-default-200' />
                  </Skeleton>
                  <Skeleton className='w-4/5 rounded-lg'>
                    <div className='h-3 w-4/5 rounded-lg bg-default-200' />
                  </Skeleton>
                  <Skeleton className='w-2/5 rounded-lg'>
                    <div className='h-3 w-2/5 rounded-lg bg-default-300' />
                  </Skeleton>
                  <Skeleton className='w-full rounded-lg'>
                    <div className='h-3 w-full rounded-lg bg-default-300' />
                  </Skeleton>
                </div>
              ) : (
                <DeliveryInformation
                  name={orderData?.full_name}
                  phone={orderData?.phone}
                  email={orderData?.email}
                  address={orderData?.address}
                />
              )}
            </div>
            <Divider orientation='vertical' />
            <div className='flex flex-col gap-4 w-1/2'>
              <PaymentDetails orderData={orderData} loading={loading} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
