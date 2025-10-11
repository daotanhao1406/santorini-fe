'use client'
import {
  Badge,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  Listbox,
  ListboxItem,
  useDisclosure,
} from '@heroui/react'
import { ShoppingBag } from 'lucide-react'
import { useLocale } from 'next-intl'
import { useCallback, useEffect, useState } from 'react'

import { createClient } from '@/lib/supabase/client'

import CartItem from '@/components/layout/cart-sidebar/cart-item'

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
      <Drawer hideCloseButton isOpen={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className='flex flex-col gap-1'>
                Shoppping Cart
              </DrawerHeader>
              <DrawerBody>
                <Listbox
                  className='p-0'
                  aria-label='Listbox menu with icons'
                  variant='faded'
                  shouldHighlightOnFocus={false}
                  selectionMode='none'
                >
                  {products.map((product) => (
                    <ListboxItem className='px-0 py-3' key={product.id}>
                      <CartItem {...product} />
                    </ListboxItem>
                  ))}
                </Listbox>
              </DrawerBody>
              <DrawerFooter>
                <Button color='danger' variant='light' onPress={onClose}>
                  Close
                </Button>
                <Button color='primary' onPress={onClose}>
                  Action
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  )
}
