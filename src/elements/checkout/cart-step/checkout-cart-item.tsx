'use client'
import { Button, Divider, useDisclosure } from '@heroui/react'
import { EditIcon, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import DeleteComfirmationModal from '@/components/delete-comfirmation-modal'
import QuantityStepper from '@/components/layout/cart-sidebar/cart-item/quantity-stepper'
import PriceDisplay from '@/components/price-display'
import Typography from '@/components/ui/typography'

import { CartItemType, useCartStore } from '@/stores/use-cart-store'
import { useProductOptionStore } from '@/stores/use-product-option-store'

import ProductOptionModal from '@/elements/menu/product/product-option-modal'

export default function CheckoutCartItem(cartItem: CartItemType) {
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
  const loadCartFromServer = useCartStore((s) => s.loadCartFromServer)
  const removeItem = useCartStore((s) => s.removeItem)
  const toppings = useProductOptionStore((s) => s.toppings)
  const buttonTranslations = useTranslations('common.buttons')
  const cartTranslations = useTranslations('cart')
  const iceTranslations = useTranslations('menu.ice')
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false)

  const onDeleteItem = async (cartItemId: string) => {
    setDeleteLoading(true)
    return await removeItem(cartItemId)
      .then(() => loadCartFromServer())
      .finally(() => {
        setDeleteLoading(false)
      })
  }

  return (
    <div>
      <div className='flex gap-3 md:gap-5'>
        <div className='relative h-24 sm:h-28 aspect-[7/8]'>
          <Image
            alt='Cart image'
            className='object-cover rounded-lg'
            src={cartItem.product.image_url}
            fill
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          />
        </div>

        <div className='flex flex-col gap-1.5 flex-1'>
          <Typography className='font-semibold -mt-1' size='lg'>
            {cartItem.product.name}
          </Typography>
          <div className='flex gap-2'>
            <Typography size='sm' type='secondary'>
              Toppings:
            </Typography>
            {cartItem.toppings.length > 0 ? (
              <Typography size='sm'>
                {cartItem.toppings.map((topping, key) => {
                  const toppingData = toppings.find((t) => t.id === topping)
                  return (
                    <span className='font-semibold' key={key}>
                      {toppingData?.name}
                      {key < cartItem.toppings.length - 1 && <span>, </span>}
                    </span>
                  )
                })}
              </Typography>
            ) : (
              <Typography className='italic' size='sm'>
                Empty
              </Typography>
            )}
          </div>
          <div className='flex gap-1 md:gap-2'>
            <Typography size='sm' type='secondary'>
              Size
            </Typography>
            <Typography size='sm' className='font-semibold'>
              {cartItem.size}
            </Typography>
            <Typography size='sm' type='secondary'>
              /
            </Typography>
            <Typography size='sm' type='secondary'>
              Sweet
            </Typography>
            <Typography size='sm' className='font-semibold'>
              {cartItem.sweetness_level}
            </Typography>
            <Typography size='sm' type='secondary'>
              /
            </Typography>
            <Typography size='sm' type='secondary'>
              Ice
            </Typography>
            <Typography size='sm' className='font-semibold'>
              {iceTranslations(cartItem.ice_level?.toString())}
            </Typography>
          </div>

          <div className='flex gap-1 pt-1 xl:mt-0'>
            <Typography size='xl' className='font-bold'>
              <PriceDisplay
                value={cartItem.product.base_price * cartItem.quantity}
              />
            </Typography>
            <Typography size='sm' variant='sup' className='font-bold mt-2'>
              đ
            </Typography>
          </div>
        </div>
      </div>
      <Divider className='my-3 md:my-5' />
      <div className='flex justify-between'>
        <Typography size='lg' className='font-bold'>
          <QuantityStepper
            value={cartItem.quantity}
            onIncrease={() => increaseQuantity(cartItem.id)}
            onDecrease={() => decreaseQuantity(cartItem.id)}
            min={1}
          />
        </Typography>
        <div className='flex gap-4'>
          <Button onPress={onEditModalOpen} size='sm' radius='sm' isIconOnly>
            <EditIcon size={18} />
          </Button>
          <Button onPress={onDeleteModalOpen} size='sm' radius='sm' isIconOnly>
            <Trash2 size={18} />
          </Button>
        </div>
      </div>
      <DeleteComfirmationModal
        message={cartTranslations('confirm_delete_message', {
          name: cartItem.product.name,
        })}
        okText={buttonTranslations('yes')}
        cancelText={buttonTranslations('no')}
        isOpen={isDeleteModalOpen}
        isLoading={deleteLoading}
        onOpenChange={onDeleteModalOpenChange}
        onConfirm={() => onDeleteItem(cartItem.id)}
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
