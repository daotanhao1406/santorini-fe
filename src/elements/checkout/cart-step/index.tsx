'use client'

import { useCartStore } from '@/stores/use-cart-store'

import CheckoutCartItem from '@/elements/checkout/cart-step/checkout-cart-item'

export default function CartStep() {
  const cartItems = useCartStore((state) => state.items)
  return (
    <div className='mt-4 space-y-8 md:space-y-12 md:mt-8'>
      {cartItems.map((item) => (
        <CheckoutCartItem key={item.id} {...item} />
      ))}
    </div>
  )
}
