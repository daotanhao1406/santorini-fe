'use client'
import {
  Badge,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  Skeleton,
  useDisclosure,
} from '@heroui/react'
import { ShoppingBag, X } from 'lucide-react'
import { useLocale } from 'next-intl'
import { Suspense, useCallback, useEffect } from 'react'

import CartItem from '@/components/layout/cart-sidebar/cart-item'
import PriceDisplay from '@/components/price-display'
import Typography from '@/components/ui/typography'

import {
  calcTotalCartItemsPrice,
  calcTotalCartItemsQuantity,
  useCartStore,
} from '@/stores/use-cart-store'
import { useProductOptionStore } from '@/stores/use-product-option-store'

export default function CartSidebar({
  isOutOfHeroSection,
}: {
  isOutOfHeroSection?: boolean
}) {
  const locale = useLocale()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const cartItems = useCartStore((state) => state.items)
  const totalPrice = calcTotalCartItemsPrice(cartItems)
  const totalQuantity = calcTotalCartItemsQuantity(cartItems)
  const fetchToppings = useProductOptionStore((s) => s.fetchToppings)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        fetchToppings(locale)
      })
    }
  }, [isOpen, locale, fetchToppings])

  const renderCartItemList = useCallback(() => {
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return (
        <div className='flex flex-col items-center gap-4 mt-20'>
          <ShoppingBag size={40} />
          <Typography size='lg' className='font-bold'>
            Your cart is empty
          </Typography>
        </div>
      )
    }

    return (
      <DrawerBody className='flex flex-col gap-6'>
        {cartItems.map((cartItem) => (
          <CartItem key={cartItem.id} {...cartItem} />
        ))}
      </DrawerBody>
    )
  }, [cartItems])

  const renderDrawerFooter = useCallback(() => {
    if (totalPrice === 0) return null

    return (
      <DrawerFooter className='flex flex-col w-full gap-4'>
        <div className='flex justify-between'>
          <Typography size='lg' className='font-semibold'>
            Total
          </Typography>
          <Typography size='lg' className='font-semibold'>
            <PriceDisplay value={totalPrice} />
          </Typography>
        </div>
        <Button color='primary'>Checkout</Button>
      </DrawerFooter>
    )
  }, [totalPrice])

  return (
    <>
      <Badge
        size='sm'
        color='danger'
        content={totalQuantity}
        isInvisible={totalQuantity === 0}
        shape='circle'
        showOutline={false}
      >
        <Button isIconOnly radius='full' variant='light' onPress={onOpen}>
          <ShoppingBag
            color={isOutOfHeroSection ? 'black' : 'white'}
            size={22}
          />
        </Button>
      </Badge>
      <Drawer
        motionProps={{
          variants: {
            enter: {
              opacity: 1,
              x: 0,
            },
            exit: {
              x: 100,
              opacity: 0,
            },
          },
        }}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        hideCloseButton
      >
        <DrawerContent>
          {(onClose) => (
            <Suspense fallback={<CartSidebarSkeleton />}>
              <DrawerHeader className='flex justify-between'>
                <Typography size='lg'>Shoppping Cart</Typography>
                <Button variant='light' isIconOnly size='sm' onPress={onClose}>
                  <X />
                </Button>
              </DrawerHeader>
              {renderCartItemList()}
              {renderDrawerFooter()}
            </Suspense>
          )}
        </DrawerContent>
      </Drawer>
    </>
  )
}

const CartSidebarSkeleton = () => {
  return (
    <div className='max-w-[300px] w-full flex items-center gap-3'>
      <div>
        <Skeleton className='flex rounded-sm w-12 h-12' />
      </div>
      <div className='w-full flex flex-col gap-2'>
        <Skeleton className='h-3 w-3/5 rounded-lg' />
        <Skeleton className='h-3 w-4/5 rounded-lg' />
      </div>
    </div>
  )
}
