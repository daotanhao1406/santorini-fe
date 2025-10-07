import { Button, Card, CardBody } from '@heroui/react'
import { ShoppingCart } from 'lucide-react'
import Image from 'next/image'

import { Product } from '@/types/product'

export default function ProductItem({
  name,
  description,
  image_url,
  base_price,
}: Product) {
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
                {typeof base_price === 'number' && (
                  <>
                    <h3 className='text-large font-bold'>
                      {base_price?.toLocaleString('en-US')}
                    </h3>
                    <p className='font-bold text-sm mt-0.5'>đ</p>
                  </>
                )}
              </div>
              <Button
                aria-label='Add to cart'
                isIconOnly
                color='primary'
                size='sm'
              >
                <ShoppingCart size={14} />
              </Button>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
