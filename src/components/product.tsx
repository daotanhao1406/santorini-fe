import { Button } from '@heroui/button'
import { ShoppingCart } from 'lucide-react'
import Image from 'next/image'

export default function ProductComponent() {
  return (
    <div className='relative w-60 h-48'>
      {/* Background shape với hình dạng theo yêu cầu */}
      <div
        className='absolute inset-0 bg-primary'
        style={{
          clipPath: 'polygon(0% 25%, 100% 0%, 100% 100%, 0% 100%)',
          borderRadius: '20px',
        }}
      />

      {/* Content container */}
      <div className='relative z-10 p-6 h-full flex flex-col'>
        {/* Product image */}
        <div className='flex-1 flex items-center justify-center mb-4'>
          <div className='w-48 h-48 absolute top-1/12 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
            <Image
              src='/images/coffee-cup.png'
              alt='Arabica Premium Espresso Coffee'
              fill
              className='object-contain'
            />
          </div>
        </div>

        {/* Product info */}
        <div className='text-center text-white'>
          <h3 className='font-semibold mb-2'>Arabian spc.</h3>
          <p className='font-bold text-yellow-300 mb-4'>$19.56</p>

          {/* Add to cart button */}
        </div>
      </div>
      <Button
        className='absolute -bottom-4 left-1/2 transform -translate-x-1/2'
        isIconOnly
      >
        <ShoppingCart />
      </Button>
    </div>
  )
}
