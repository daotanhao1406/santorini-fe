'use client'
import { Divider, Tab, Tabs } from '@heroui/react'
import { useTranslations } from 'next-intl'

import { cn } from '@/lib/utils'

import Typography from '@/components/ui/typography'

import { useCheckoutStore } from '@/stores/use-checkout-store'

import CartStep from '@/elements/checkout/cart-step'
import CheckoutStep from '@/elements/checkout/checkout-step'
import PaymentStep from '@/elements/checkout/payment-step'

export default function CheckoutStepper() {
  const checkoutStepperTranslations = useTranslations(
    'checkout.checkout_stepper',
  )
  const { currentStep, setStep } = useCheckoutStore()

  const stepList = [
    {
      label: checkoutStepperTranslations('cart'),
      key: 1,
      children: <CartStep />,
    },
    {
      label: checkoutStepperTranslations('checkout'),
      key: 2,
      children: <CheckoutStep />,
    },
    {
      label: checkoutStepperTranslations('payment'),
      key: 3,
      children: <PaymentStep />,
    },
  ]

  return (
    <div className='flex w-full flex-col'>
      <Tabs
        aria-label='Options'
        classNames={{
          tabList:
            'gap-0 relative rounded-none p-0 pointer-events-none cursor-default',
          cursor: 'bg-transparent',
          tab: 'max-w-full pr-1 md:pr-4',
          tabContent: `group-data-[selected=true]:font-semibold text-inherit`,
          tabWrapper: 'p-0',
          base: 'p-0',
        }}
        selectedKey={String(currentStep)}
        color='primary'
        variant='underlined'
        onSelectionChange={(key) => {
          setStep(Number(key))
        }}
      >
        {stepList.map((item) => {
          return (
            <Tab
              key={item.key}
              title={
                <div className='flex items-center space-x-3 md:space-x-6'>
                  <Typography
                    type={item.key > currentStep ? 'secondary' : 'default'}
                    className={
                      item.key === currentStep
                        ? 'font-semibold'
                        : item.key < currentStep
                          ? 'font-medium'
                          : ''
                    }
                  >
                    {item.key}. {item.label}
                  </Typography>
                  {item.key !== stepList.length && (
                    <Divider
                      className={cn(
                        'xl:w-16 md:w-12 w-8',
                        item.key < currentStep && 'bg-[#11181c]',
                      )}
                    />
                  )}
                </div>
              }
            >
              {item.children}
            </Tab>
          )
        })}
      </Tabs>
    </div>
  )
}
