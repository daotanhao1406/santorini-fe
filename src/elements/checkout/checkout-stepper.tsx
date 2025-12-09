'use client'
import { Divider, Tab, Tabs } from '@heroui/react'
import { useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'

import { cn } from '@/lib/utils'

import Typography from '@/components/ui/typography'

import { useUserStore } from '@/stores/use-user-store'

import CartStep from '@/elements/checkout/cart-step'

export default function CheckoutStepper({
  currentStep,
}: {
  currentStep: number
}) {
  const { isAuthenticated } = useUserStore()
  const checkoutStepperTranslations = useTranslations(
    'checkout.checkout_stepper',
  )
  const [selectedTab, setSelectedTab] = useState<number>(currentStep)

  const stepList = useMemo(() => {
    if (!isAuthenticated) {
      return [
        {
          label: checkoutStepperTranslations('cart'),
          key: 1,
          children: <CartStep />,
        },
        {
          label: checkoutStepperTranslations('login'),
          key: 2,
          children: <div></div>,
        },
        {
          label: checkoutStepperTranslations('checkout'),
          key: 3,
          children: <div></div>,
        },
        {
          label: checkoutStepperTranslations('payment'),
          key: 4,
          children: <div></div>,
        },
      ]
    }
    return [
      {
        label: checkoutStepperTranslations('cart'),
        key: 1,
        children: <CartStep />,
      },
      {
        label: checkoutStepperTranslations('checkout'),
        key: 2,
        children: <div></div>,
      },
      {
        label: checkoutStepperTranslations('checkout'),
        key: 3,
        children: <div></div>,
      },
    ]
  }, [isAuthenticated, checkoutStepperTranslations])

  return (
    <div className='flex w-full flex-col'>
      <Tabs
        aria-label='Options'
        classNames={{
          tabList: 'gap-0 relative rounded-none p-0',
          cursor: 'bg-transparent',
          tab: 'max-w-full pr-1 md:pr-4',
          tabContent: `group-data-[selected=true]:font-semibold text-inherit`,
          tabWrapper: 'p-0',
          base: 'p-0',
        }}
        // selectedKey={selectedTab}
        color='primary'
        variant='underlined'
        onSelectionChange={(key) => setSelectedTab(Number(key))}
      >
        {stepList.map((item) => {
          return (
            <Tab
              key={item.key}
              title={
                <div className='flex items-center space-x-3 md:space-x-6'>
                  <Typography
                    type={item.key > selectedTab ? 'secondary' : 'default'}
                    className={item.key < selectedTab ? 'font-medium' : ''}
                  >
                    {item.key}. {item.label}
                  </Typography>
                  {item.key !== stepList.length && (
                    <Divider
                      className={cn(
                        'xl:w-16 md:w-12 w-8',
                        item.key < selectedTab && 'bg-[#11181c]',
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
