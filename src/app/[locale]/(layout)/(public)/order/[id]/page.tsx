'use client'
import { Button, Divider } from '@heroui/react'
import { use } from 'react'

import Typography from '@/components/ui/typography'

import { useCartStore } from '@/stores/use-cart-store'

import DeliveryInformation from '@/elements/order/delivery-information'
import OrderListCard from '@/elements/order/order-list-card'
import OrderStatusStepper from '@/elements/order/order-status-stepper'
import PaymentDetails from '@/elements/order/payment-details'

export default function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { items } = useCartStore()
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
          Order ID: #{id}
        </Typography>
      </div>
      <Divider className='my-6' />
      <div className='flex w-full gap-12'>
        {/* left section */}
        <OrderListCard orderItems={items} />

        {/* right section */}
        <div className='flex flex-col flex-1'>
          {/* order status */}
          <OrderStatusStepper
            currentStatus='paid'
            timeline={[
              {
                status: 'placed',
                timestamp: '2025-10-18T16:01:39.270103+00:00',
              },
              {
                status: 'paid',
                timestamp: '2025-10-18T16:30:39.270103+00:00',
              },
            ]}
          />
          <Divider className='mt-6 mb-10' />

          {/* actions section */}
          <div className='flex justify-between'>
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
              <DeliveryInformation
                name='John Doe'
                phone='1234567890'
                email='abc@gmail.com'
                address='88 Street 26, Hiep Binh Chanh, Thu Duc, Ho Chi Minh City'
              />
            </div>
            <Divider orientation='vertical' />
            <div className='flex flex-col gap-4 w-1/2'>
              {/* <Typography className='font-semibold' size='lg'>
                Payment Details
              </Typography> */}
              <PaymentDetails />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
