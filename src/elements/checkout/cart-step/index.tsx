'use client'

import { useCartStore } from '@/stores/use-cart-store'

import CheckoutCartItem from '@/elements/checkout/cart-step/checkout-cart-item'

export default function CartStep() {
  const cartItems = useCartStore((state) => state.items)
  return (
    <div className='w-full md:max-w-11/12 lg:w-xl xl:w-3xl mt-4 space-y-8 md:space-y-12 md:mt-8'>
      {cartItems.map((item) => (
        <CheckoutCartItem key={item.id} {...item} />
      ))}
    </div>
  )
}
