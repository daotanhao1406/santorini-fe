import { getTranslations } from 'next-intl/server'

import Typography from '@/components/ui/typography'

import CheckoutStepper from '@/elements/checkout/checkout-stepper'
import CouponCard from '@/elements/checkout/coupon-card'
import OrderSummary from '@/elements/checkout/order-summary-card'

export default async function CheckoutPage() {
  const checkoutTranslations = await getTranslations('checkout')
  return (
    <div className='md:m-8 m-4 flex flex-col flex-1'>
      <Typography className='text-start font-medium font-playfair' size='xxxl'>
        {checkoutTranslations('title')}
      </Typography>
      <div className='flex mt-4 lg:mt-6 xl:mt-8 gap-4'>
        <div className='max-w-5xl'>
          <CheckoutStepper currentStep={2} />
        </div>
        <div className='flex flex-col md:items-end gap-6 mt-6 md:mt-0'>
          <OrderSummary />
          <CouponCard />
        </div>
      </div>
    </div>
  )
}
