'use client'
import {
  Badge,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  useDisclosure,
} from '@heroui/react'
import { ShoppingBag, X } from 'lucide-react'
import { useLocale } from 'next-intl'
import { useCallback, useEffect, useState } from 'react'

import { createClient } from '@/lib/supabase/client'

import CartItem from '@/components/layout/cart-sidebar/cart-item'
import PriceDisplay from '@/components/price-display'
import Typography from '@/components/ui/typography'

import { Product } from '@/types/product'

export default function CartSidebar({
  isOutOfHeroSection,
}: {
  isOutOfHeroSection?: boolean
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [products, setProducts] = useState<Product[]>([])
  const locale = useLocale()
  const supabase = createClient()

  const loadProducts = useCallback(async () => {
    const { data } = await supabase
      .from('products_with_translations')
      .select('*, categories!inner(*)')
      .eq('categories.slug', 'milk-tea')
      .eq('locale', locale)

    setProducts(data as Product[])
  }, [locale, supabase])

  const renderCartItemList = useCallback(() => {
    if (!Array.isArray(products) || products.length === 0) {
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
        {products.map((product) => (
          <CartItem key={product.id} {...product} />
        ))}
      </DrawerBody>
    )
  }, [products])

  const renderDrawerFooter = useCallback(() => {
    if (!Array.isArray(products) || products.length === 0) return null

    const totalPrice = products.reduce(
      (total, product) => total + product.base_price,
      0,
    )

    return (
      <DrawerFooter className='flex flex-col w-full gap-4'>
        <div className='flex justify-between'>
          <Typography size='sm' className='font-semibold'>
            Total
          </Typography>
          <Typography size='sm' className='font-semibold'>
            <PriceDisplay value={totalPrice} />
          </Typography>
        </div>
        <Button color='primary'>Checkout</Button>
      </DrawerFooter>
    )
  }, [products])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  return (
    <>
      <Badge
        size='sm'
        color='danger'
        content='20'
        shape='circle'
        showOutline={false}
      >
        <Button
          isIconOnly
          aria-label='more than 99 notifications'
          radius='full'
          variant='light'
          onPress={onOpen}
        >
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
            <>
              <DrawerHeader className='flex justify-between'>
                <Typography size='lg'>Shoppping Cart</Typography>
                <Button variant='light' isIconOnly size='sm' onPress={onClose}>
                  <X />
                </Button>
              </DrawerHeader>
              {renderCartItemList()}
              {renderDrawerFooter()}
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  )
}
