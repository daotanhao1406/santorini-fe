'use client'

import { Button } from '@heroui/react'
import { useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'

import Typography from '@/components/ui/typography'

import CheckoutStepper from '@/elements/checkout/checkout-stepper'
import CouponCard from '@/elements/checkout/coupon-card'
import OrderSummary from '@/elements/checkout/order-summary-card'

export default function CheckoutPage() {
  const checkoutTranslations = useTranslations('checkout')
  const orderSummaryTranslations = useTranslations('checkout.order_summary')

  const [currentStep, setCurrentStep] = useState<number>(1)

  const checkoutBtnText = useMemo(() => {
    const stepText: Record<number, string> = {
      1: orderSummaryTranslations('proceed_to_checkout_btn'),
      2: orderSummaryTranslations('proceed_to_checkout_btn'),
      3: orderSummaryTranslations('proceed_to_checkout_btn'),
    }
    return (
      stepText[currentStep] ??
      orderSummaryTranslations('proceed_to_checkout_btn')
    )
  }, [currentStep, orderSummaryTranslations])

  return (
    <div className='md:m-8 m-4 flex flex-col flex-1'>
      <Typography className='text-start font-medium font-playfair' size='xxxl'>
        {checkoutTranslations('title')}
      </Typography>
      <div className='flex justify-between mt-4 lg:mt-6 xl:mt-8 gap-4'>
        <div className='max-w-5xl'>
          <CheckoutStepper
            currentStep={currentStep}
            onStepChange={setCurrentStep}
          />
        </div>
        <div className='flex flex-col md:items-end gap-6 mt-6 md:mt-0'>
          <OrderSummary
            renderCheckoutBtn={
              <Button
                color='primary'
                radius='full'
                className='font-medium mt-6'
                onPress={() =>
                  setCurrentStep((prev) => (prev < 4 ? prev + 1 : prev))
                }
              >
                {checkoutBtnText}
              </Button>
            }
            renderStepBackBtn={
              currentStep > 1 && (
                <Button
                  variant='faded'
                  radius='full'
                  className='font-medium mt-2 bg-white'
                  onPress={() => setCurrentStep((prev) => prev - 1)}
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
