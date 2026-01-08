import { Chip, Divider, Skeleton } from '@heroui/react'
import Image from 'next/image'

import { formatTime } from '@/lib/utils'

import PriceDisplay from '@/components/price-display'
import Typography from '@/components/ui/typography'

import { IOrder } from '@/types/order'

export default function PaymentDetails({
  orderData,
  loading,
}: {
  orderData: IOrder | null
  loading?: boolean
}) {
  if (loading) {
    return (
      <div className='space-y-6'>
        <div className='max-w-[300px] w-full flex items-center gap-3'>
          <div>
            <Skeleton className='flex rounded-full w-12 h-12' />
          </div>
          <div className='w-full flex flex-col gap-2'>
            <Skeleton className='h-3 w-3/5 rounded-lg' />
            <Skeleton className='h-3 w-4/5 rounded-lg' />
          </div>
        </div>

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
        </div>
      </div>
    )
  }
  return (
    <div className=''>
      <div className='flex justify-between w-full flex-1'>
        <div className='flex gap-3'>
          {orderData?.payment_method === 'momo' ? (
            <Image
              src='/images/momo.png'
              alt='Momo'
              width={40}
              height={40}
              className='object-contain rounded-md'
            />
          ) : (
            <Image
              src='/images/cash.png'
              alt='Cash'
              width={40}
              height={40}
              className='object-contain rounded-md'
            />
          )}

          <div className='flex flex-col'>
            <Typography className='font-semibold'>
              {orderData?.phone}
            </Typography>
            <Typography size='sm' type='secondary' className='font-medium'>
              {formatTime(orderData?.created_at, 'dd/MM/yyyy HH:mm')}
            </Typography>
          </div>
        </div>
        <Chip color='success' size='sm' variant='shadow'>
          Paid
        </Chip>
      </div>

      <div className='flex justify-between mt-4'>
        <div className='flex flex-col gap-2'>
          <Typography type='secondary' className='font-medium' size='sm'>
            Order amount
          </Typography>
          <Typography type='secondary' className='font-medium' size='sm'>
            Coupon discount
          </Typography>
          <Typography type='secondary' className='font-medium' size='sm'>
            Shipping fee
          </Typography>
        </div>
        <div className='flex flex-col items-end gap-1'>
          <Typography className='font-semibold'>
            <PriceDisplay value={orderData?.sub_total_price || 0} />
          </Typography>
          <Typography className='font-semibold'>
            -<PriceDisplay value={orderData?.discount || 0} />
          </Typography>
          <Typography className='font-semibold'>
            <PriceDisplay value={orderData?.shipping_fee || 0} />
          </Typography>
        </div>
      </div>

      <Divider className='my-3' />

      <div className='flex justify-between'>
        <Typography type='secondary' className='font-medium'>
          Total amount
        </Typography>
        <Typography type='primary' size='lg' className='font-semibold'>
          <PriceDisplay value={orderData?.total_price || 0} />
        </Typography>
      </div>
    </div>
  )
}
