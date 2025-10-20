'use client'

import { Badge, Button, useDisclosure } from '@heroui/react'
import { ShoppingCart } from 'lucide-react'

import { useIsMobile } from '@/hooks/use-media-query'

import { useCartStore } from '@/stores/use-cart-store'

import ProductOptionModal from '@/elements/menu/product/product-option-modal'

import { IProduct } from '@/types/product'

export default function AddToCartButton(product: IProduct) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const cartItems = useCartStore((state) => state.items)
  const isMobile = useIsMobile()

  const totalProductsInCart = cartItems
    .filter((cartItem) => cartItem.product.id === product.id)
    .reduce((total, cartItem) => total + cartItem.quantity, 0)

  return (
    <>
      <Badge
        onClick={onOpen}
        content={totalProductsInCart}
        isInvisible={totalProductsInCart === 0}
        color='secondary'
        placement='top-right'
        size={isMobile ? 'sm' : 'md'}
      >
        <Button
          aria-label='Add to cart'
          isIconOnly
          color='primary'
          size='sm'
          onPress={onOpen}
        >
          <ShoppingCart size={14} />
        </Button>
      </Badge>
      <ProductOptionModal
        product={product}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      />
    </>
  )
}
