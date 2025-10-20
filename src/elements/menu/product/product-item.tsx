import { Card, CardBody } from '@heroui/react'
import Image from 'next/image'

import PriceDisplay from '@/components/price-display'
import Typography from '@/components/ui/typography'

import AddToCartButton from '@/elements/menu/product/add-to-cart-button'

import { IProduct } from '@/types/product'

export default function ProductItem(product: IProduct) {
  const { name, description, image_url, base_price } = product
  return (
    <Card className='text-sm'>
      <CardBody className='p-5'>
        <div className='flex gap-6 md:gap-4 justify-center'>
          <div className='relative h-28 aspect-[5/6]'>
            <Image
              alt={`${name || 'Product'} image`}
              className='object-cover rounded-xl'
              src={image_url}
              fill
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            />
          </div>

          <div className='flex flex-col justify-between flex-1'>
            <div className='flex flex-col gap-1'>
              <h1 className='text-large font-semibold'>{name}</h1>
              <p className='text-xs text-foreground/60'>{description}</p>
            </div>
            <div className='flex justify-between items-end'>
              <div className='flex gap-1 pt-0 xl:pt-2'>
                <Typography size='lg' className='font-bold'>
                  <PriceDisplay value={base_price} />
                </Typography>
                <Typography size='sm' variant='sup' className='font-bold mt-2'>
                  đ
                </Typography>
              </div>
              <AddToCartButton {...product} />
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
