'use client'
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from '@heroui/react'
import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

import IceLevelSelector from '@/components/ice-level-selector'
import QuantityStepper from '@/components/layout/cart-sidebar/cart-item/quantity-stepper'
import PriceDisplay from '@/components/price-display'
import SizeSelector from '@/components/size-selector'
import SweetnessLevelSelector from '@/components/sweetness-level-selector'
import ToppingSelector from '@/components/topping-selector'
import Typography from '@/components/ui/typography'

import { CartItemType, useCartStore } from '@/stores/use-cart-store'
import { useProductOptionStore } from '@/stores/use-product-option-store'

import {
  ICE_LEVEL,
  IProduct,
  ProductOptionsType,
  SIZE,
  SWEETNESS_LEVEL,
} from '@/types/product'

interface ProductOptionModalProps {
  product: IProduct
  cartItem?: CartItemType
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export default function ProductOptionModal({
  product,
  cartItem,
  isOpen,
  onOpenChange,
}: ProductOptionModalProps) {
  const locale = useLocale()
  const productModalTranslations = useTranslations('menu.product_option_modal')
  const buttonTranslations = useTranslations('common.buttons')
  const [selectedSize, setSelectedSize] = useState<ProductOptionsType['size']>(
    cartItem?.size || SIZE.M,
  )
  const [selectedIceLevel, setSelectedIceLevel] = useState<
    ProductOptionsType['ice_level']
  >(cartItem?.ice_level || ICE_LEVEL.NORMAL)
  const [selectedSweetnessLevel, setSelectedSweetnessLevel] = useState<
    ProductOptionsType['sweetness_level']
  >(cartItem?.sweetness_level || SWEETNESS_LEVEL.NORMAL)
  const [selectedToppings, setSelectedToppings] = useState<string[]>(
    cartItem?.toppings || [],
  )
  const [note, setNote] = useState<string>(cartItem?.note || '')
  const [quantity, setQuantity] = useState<number>(cartItem?.quantity || 1)
  const [loading, setLoading] = useState<boolean>(false)

  const toppings = useProductOptionStore((s) => s.toppings)
  const fetchToppings = useProductOptionStore((s) => s.fetchToppings)
  const addItem = useCartStore((s) => s.addItem)
  const updateItem = useCartStore((s) => s.updateItem)
  const loadCartFromServer = useCartStore((s) => s.loadCartFromServer)

  const onSubmit = async () => {
    setLoading(true)
    const formData: CartItemType = {
      id: cartItem?.id || '',
      product,
      size: selectedSize,
      ice_level: selectedIceLevel,
      sweetness_level: selectedSweetnessLevel,
      toppings: selectedToppings,
      note,
      quantity,
    }
    return cartItem
      ? await updateItem(formData)
        .then(() => {
          loadCartFromServer()
        })
        .finally(() => {
          setLoading(false)
        })
      : await addItem(formData)
        .then(() => {
          loadCartFromServer()
        })
        .finally(() => {
          setLoading(false)
        })
  }

  useEffect(() => {
    if (isOpen) {
      fetchToppings(locale)
    }
  }, [isOpen, locale, fetchToppings])

  return (
    <Modal
      size='4xl'
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      scrollBehavior='inside'
      className='max-h-5/6'
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className='flex flex-col gap-1'></ModalHeader>
            <ModalBody className='flex flex-row lg:gap-10 lg:px-8'>
              <div className='hidden lg:block'>
                <div className='relative lg:h-80 aspect-[4/5]'>
                  <Image
                    alt={`${product.name || 'Product'} image`}
                    className='object-cover rounded-xl'
                    src={product.image_url}
                    fill
                    sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                  />
                </div>
              </div>
              <div className='flex flex-col flex-1'>
                <div className='flex justify-between'>
                  <Typography size='xl' className='font-bold'>
                    {product.name}
                  </Typography>
                  <div className='flex gap-1 pt-0 xl:pt-1'>
                    <Typography className='font-bold'>
                      <PriceDisplay value={product.base_price} />
                    </Typography>
                    <Typography
                      size='sm'
                      variant='sup'
                      className='font-bold mt-2'
                    >
                      đ
                    </Typography>
                  </div>
                </div>
                <Typography>{product.description}</Typography>

                <Typography className='font-semibold mt-6 mb-2'>
                  Size
                </Typography>
                <SizeSelector value={selectedSize} onChange={setSelectedSize} />

                <Typography className='font-semibold mt-4 mb-2'>
                  {productModalTranslations('ice_level')}
                </Typography>
                <IceLevelSelector
                  value={selectedIceLevel}
                  onChange={setSelectedIceLevel}
                />

                <Typography className='font-semibold mt-4 mb-2'>
                  {productModalTranslations('sweetness_level')}
                </Typography>
                <SweetnessLevelSelector
                  value={selectedSweetnessLevel}
                  onChange={setSelectedSweetnessLevel}
                />

                <Typography className='font-semibold mt-4 mb-2'>
                  Toppings
                </Typography>
                <ToppingSelector
                  name='toppings'
                  toppings={toppings}
                  value={selectedToppings}
                  onChange={setSelectedToppings}
                />

                <Typography className='font-semibold mt-4 mb-2'>
                  {productModalTranslations('note')}
                </Typography>
                <Textarea
                  maxRows={3}
                  isClearable
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  variant='bordered'
                  placeholder={productModalTranslations('note_placeholder')}
                />
              </div>
            </ModalBody>
            <ModalFooter className='gap-8'>
              <div className='flex gap-4 items-center'>
                <Typography className='font-semibold'>
                  <QuantityStepper
                    value={quantity}
                    onIncrease={() => setQuantity((q) => q + 1)}
                    onDecrease={() => setQuantity((q) => q - 1)}
                    min={1}
                  />
                </Typography>
                <div className='flex gap-1'>
                  <Typography size='lg' className='font-bold'>
                    <PriceDisplay value={product.base_price * quantity} />
                  </Typography>
                  <Typography
                    size='sm'
                    variant='sup'
                    className='font-bold mt-2'
                  >
                    đ
                  </Typography>
                </div>
              </div>
              <Button
                color='primary'
                isLoading={loading}
                onPress={async () => {
                  await onSubmit().finally(() => onClose())
                }}
              >
                {cartItem ? buttonTranslations('update') : productModalTranslations('add_button_text')}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
