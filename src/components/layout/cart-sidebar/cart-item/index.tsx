'use client'

import { Badge, useDisclosure } from '@heroui/react'
import { Pencil, X } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

import { useIsMobile } from '@/hooks/use-media-query'

import DeleteComfirmationModal from '@/components/delete-comfirmation-modal'
import QuantityStepper from '@/components/layout/cart-sidebar/cart-item/quantity-stepper'
import PriceDisplay from '@/components/price-display'
import Typography from '@/components/ui/typography'

import { CartItemType, useCartStore } from '@/stores/use-cart-store'
import { useProductOptionStore } from '@/stores/use-product-option-store'

import ProductOptionModal from '@/elements/menu/product/product-option-modal'

export default function CartItem(cartItem: CartItemType) {
  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose,
    onOpenChange: onDeleteModalOpenChange,
  } = useDisclosure()
  const {
    isOpen: isEditModalOpen,
    onOpen: onEditModalOpen,
    onOpenChange: onEditModalOpenChange,
  } = useDisclosure()
  const increaseQuantity = useCartStore((s) => s.increaseQuantity)
  const decreaseQuantity = useCartStore((s) => s.decreaseQuantity)
  const removeItem = useCartStore((s) => s.removeItem)
  const toppings = useProductOptionStore((s) => s.toppings)
  const iceTranslations = useTranslations('MenuPage.ice')
  const isMobile = useIsMobile()
  return (
    <div className='group flex gap-3 md:gap-4 justify-center relative'>
      <Badge
        className='cursor-pointer lg:opacity-0 group-hover:opacity-100 transition-opacity duration-200'
        isOneChar
        onClick={onDeleteModalOpen}
        color='danger'
        content={<X />}
        placement='top-left'
        size={isMobile ? 'sm' : 'md'}
      >
        <div className='relative h-16 sm:h-20 aspect-[7/8]'>
          <Image
            alt='Cart image'
            className='object-cover rounded-xl'
            src={cartItem.product.image_url}
            fill
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          />
        </div>
      </Badge>

      <div className='flex justify-between flex-1'>
        <div className='flex flex-col'>
          <Typography className='font-semibold -mt-1' size='md'>
            {cartItem.product.name} ({cartItem.size})
          </Typography>
          <Typography size='sm'>{cartItem.sweetness} sugar</Typography>
          <Typography size='sm'>
            {iceTranslations(cartItem.ice.toString())}
          </Typography>
          {cartItem.toppings.length > 0 &&
            cartItem.toppings.map((topping) => {
              const toppingData = toppings.find((t) => t.id === topping)
              return (
                <Typography key={topping} size='sm'>
                  {toppingData?.name}
                </Typography>
              )
            })}
          <Typography size='sm' type='secondary'>
            {cartItem.note}
          </Typography>
          <Typography
            onClick={onEditModalOpen}
            className='font-semibold flex items-center gap-1 cursor-pointer mt-0.5'
            size='sm'
            type='primary'
          >
            <Pencil size={12} />
            Edit
          </Typography>
        </div>
        <div className='flex flex-col justify-between items-end font-semibold'>
          <Typography className='font-semibold'>
            <PriceDisplay
              value={cartItem.product.base_price * cartItem.quantity}
            />
          </Typography>
          <QuantityStepper
            value={cartItem.quantity}
            onIncrease={() => increaseQuantity(cartItem.id)}
            onDecrease={() => decreaseQuantity(cartItem.id)}
            min={1}
          />
        </div>
      </div>
      <DeleteComfirmationModal
        message='Are you sure you want to delete this item from the shopping cart?'
        isOpen={isDeleteModalOpen}
        onOpenChange={onDeleteModalOpenChange}
        onConfirm={() => removeItem(cartItem.id)}
        onCancel={onDeleteModalClose}
      />
      {isEditModalOpen && (
        <ProductOptionModal
          product={cartItem.product}
          cartItem={cartItem}
          isOpen={isEditModalOpen}
          onOpenChange={onEditModalOpenChange}
        />
      )}
    </div>
  )
}
