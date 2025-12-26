import { Chip, Divider } from '@heroui/react'
import Image from 'next/image'

import PriceDisplay from '@/components/price-display'
import Typography from '@/components/ui/typography'

export default function PaymentDetails() {
  return (
    <div className=''>
      <div className='flex justify-between w-full flex-1'>
        <div className='flex gap-3'>
          <Image
            src='/images/momo.png'
            alt='Momo'
            width={40}
            height={40}
            className='object-contain rounded-md'
          />
          <div className='flex flex-col'>
            <Typography className='font-semibold'>+84 925 5525</Typography>
            <Typography size='sm' type='secondary' className='font-medium'>
              19/12/2023, 19:23
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
            <PriceDisplay value={580000} />
          </Typography>
          <Typography className='font-semibold'>
            -<PriceDisplay value={40000} />
          </Typography>
          <Typography className='font-semibold'>0</Typography>
        </div>
      </div>

      <Divider className='my-3' />

      <div className='flex justify-between'>
        <Typography type='secondary' className='font-medium'>
          Total amount
        </Typography>
        <Typography type='primary' size='lg' className='font-semibold'>
          <PriceDisplay value={580000 - 40000} />
        </Typography>
      </div>
    </div>
  )
}
