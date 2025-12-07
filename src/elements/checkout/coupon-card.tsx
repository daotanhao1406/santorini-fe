'use client'
import { Card, CardBody, CardHeader, Input } from '@heroui/react'
import { useTranslations } from 'next-intl'

import Typography from '@/components/ui/typography'

export default function CouponCard() {
  const couponTranslations = useTranslations('checkout.coupon')
  const commonTranslation = useTranslations('common.buttons')
  return (
    <Card
      classNames={{ base: 'bg-default-100 px-3 py-1.5 w-full md:w-84' }}
      shadow='none'
    >
      <CardHeader className='font-semibold pb-0'>
        {couponTranslations('title')}
      </CardHeader>
      <CardBody>
        <Input
          placeholder={couponTranslations('coupon_input_placeholder')}
          radius='sm'
          size='lg'
          classNames={{
            inputWrapper:
              'bg-white data-[hover=true]:bg-default-50 group-data-[focus=true]:bg-white',
          }}
          endContent={
            <Typography
              className='font-semibold cursor-pointer min-w-16 text-end'
              size='sm'
              type='primary'
            >
              {commonTranslation('apply')}
            </Typography>
          }
        />
      </CardBody>
    </Card>
  )
}
