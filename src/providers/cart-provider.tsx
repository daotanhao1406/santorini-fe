'use client'

import { useLocale } from 'next-intl'
import { ReactNode, useEffect } from 'react'

import { useCartStore } from '@/stores/use-cart-store'
import { useProductOptionStore } from '@/stores/use-product-option-store'

export default function CartProvider({ children }: { children: ReactNode }) {
  const loadCartFromServer = useCartStore((state) => state.loadCartFromServer)
  const fetchToppings = useProductOptionStore((state) => state.fetchToppings)
  const locale = useLocale()

  useEffect(() => {
    loadCartFromServer()
    fetchToppings(locale)
  }, [locale, loadCartFromServer, fetchToppings])

  return <>{children}</>
}
