import { Card, CardBody, CardHeader, Input } from '@heroui/react'

import Typography from '@/components/ui/typography'

export default function CouponCard() {
  return (
    <Card
      classNames={{ base: 'bg-default-100 px-3 py-1.5 w-full md:w-84' }}
      shadow='none'
    >
      <CardHeader className='font-semibold pb-0'>Have a Coupon?</CardHeader>
      <CardBody>
        <Input
          placeholder='Coupon Code'
          radius='sm'
          classNames={{
            inputWrapper:
              'bg-white data-[hover=true]:bg-default-50 group-data-[focus=true]:bg-white',
          }}
          endContent={
            <Typography
              className='font-semibold cursor-pointer'
              size='sm'
              type='primary'
            >
              Apply
            </Typography>
          }
        />
      </CardBody>
    </Card>
  )
}
