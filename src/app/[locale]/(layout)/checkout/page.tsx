'use client'

import { Button } from '@heroui/react'
import { useTranslations } from 'next-intl'

import Typography from '@/components/ui/typography'

import { useCartStore } from '@/stores/use-cart-store'
import { useCheckoutStore } from '@/stores/use-checkout-store'

import CheckoutStepper from '@/elements/checkout/checkout-stepper'
import CouponCard from '@/elements/checkout/coupon-card'
import OrderSummary from '@/elements/checkout/order-summary-card'

export default function CheckoutPage() {
  const checkoutTranslations = useTranslations('checkout')
  const orderSummaryTranslations = useTranslations('checkout.order_summary')

  const checkoutItems = useCartStore((state) => state.items)
  const { currentStep, nextStep, prevStep } = useCheckoutStore()

  const renderSubmitButton = () => {
    // STEP 1: CART REVIEW
    if (currentStep === 1) {
      return (
        <Button
          color='primary'
          radius='full'
          className='w-full mt-6'
          onPress={nextStep} // Chỉ đơn giản là chuyển bước
        >
          {orderSummaryTranslations('proceed_to_checkout_btn') ||
            'Proceed to Checkout'}
        </Button>
      )
    }

    // STEP 2: FILL INFORMATION (Form Submit)
    if (currentStep === 2) {
      return (
        <Button
          color='primary'
          radius='full'
          className='w-full mt-6'
          type='submit' // <--- Type submit
          form='checkout-form' // <--- Link tới ID của form bên trong Step 2
        >
          {orderSummaryTranslations('proceed_to_checkout_btn') ||
            'Continue to Payment'}
        </Button>
      )
    }

    // STEP 3: PAYMENT
    if (currentStep === 3) {
      return (
        <Button
          color='primary'
          radius='full'
          className='w-full mt-6'
          type='submit' // <--- Type submit
          form='payment-form' // <--- Link tới ID của form bên
        >
          {orderSummaryTranslations('proceed_to_checkout_btn') || 'Place Order'}
        </Button>
      )
    }
  }

  return (
    <div className='md:m-8 m-4 flex flex-col flex-1'>
      <Typography className='text-start font-medium font-playfair' size='xxxl'>
        {checkoutTranslations('title')}
      </Typography>
      <div className='flex flex-col md:flex-row justify-between mt-4 lg:mt-6 xl:mt-8 gap-4'>
        <div className='max-w-5xl'>
          <CheckoutStepper />
        </div>
        <div className='flex flex-col gap-6 mt-6 md:mt-0'>
          <OrderSummary
            checkoutItems={checkoutItems}
            showOrderSummaryItems={currentStep > 1}
            renderCheckoutBtn={renderSubmitButton()}
            renderStepBackBtn={
              currentStep > 1 && (
                <Button
                  variant='faded'
                  radius='full'
                  className='font-medium mt-2 bg-white'
                  onPress={prevStep}
                >
                  Back
                </Button>
              )
            }
          />
          <CouponCard />
        </div>
      </div>
    </div>
  )
}
