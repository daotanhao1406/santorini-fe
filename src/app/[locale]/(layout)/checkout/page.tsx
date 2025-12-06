import Typography from '@/components/ui/typography'

import CheckoutStepper from '@/elements/checkout/checkout-stepper'
import CouponCard from '@/elements/checkout/coupon-card'
import OrderSummary from '@/elements/checkout/order-summary-card'

export default function CheckoutPage() {
  return (
    <div className='md:m-8 m-4 flex flex-col overflow-auto'>
      <Typography className='text-start font-medium font-playfair' size='xxxl'>
        Payment
      </Typography>
      <div className='grid grid-cols-1 md:grid-cols-3 mt-4 lg:mt-6 xl:mt-8'>
        <div className='md:col-span-2 col-span-1'>
          <CheckoutStepper currentStep={2} />
        </div>
        <div className='col-span-1 flex flex-col md:items-end gap-6 mt-6 md:mt-0'>
          <OrderSummary />
          <CouponCard />
        </div>
      </div>
    </div>
  )
}
