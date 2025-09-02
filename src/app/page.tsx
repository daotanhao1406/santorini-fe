'use client'
import { Button } from '@heroui/button'
import Image from 'next/image'
import { useEffect, useState } from 'react'

import { createClient } from '@/lib/supabase/client'

import NavBar from '@/components/layout/header'
import Typography from '@/components/ui/typography'

export default function HomePage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = async () => {
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.from('products').select('name')
    if (error) {
      setError(error.message)
    } else {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  return (
    <main className='p-5 bg-background'>
      <div className='mt-4'>
        <NavBar />
      </div>

      {/* Hero section */}
      <div className='flex justify-between'>
        {/* Text Content */}
        <div className='flex flex-col gap-14 items-start justify-center'>
          <Typography size='7xl' className='font-pacifico'>
            Fuel Your Day with Our
          </Typography>
          <span className='font-pacifico text-7xl'>
            Expertly Crafted Coffee
          </span>

          <Typography className='text-lg max-w-2xl'>
            Discover a world of flavors with our carefully selected coffee bean.
            Indulge in the art of coffee-making with our expertly roasted bean.
          </Typography>

          <div className='flex gap-8 mt-8'>
            <div className='w-44 h-44 relative bg-primary rounded-xl flex flex-col justify-end items-center pb-4'>
              <Image
                src='/images/highland-tea.png'
                className='absolute -top-1/3 left-2'
                width={160}
                height={160}
                alt='highland-tea'
              />
              <span className='text-white leading-4'>Trà Sữa Gạo</span>
              <span className='font-pacifico text-secondary text-lg'>
                39.000đ
              </span>
            </div>
            <div className='w-44 h-44 relative bg-primary rounded-xl flex flex-col justify-end items-center pb-4'>
              <Image
                src='/images/matcha.png'
                className='absolute -top-1/5 left-[27%]'
                width={80}
                height={160}
                alt='matcha'
              />
              <span className='text-white leading-4'>Matcha Latte</span>
              <span className='font-pacifico text-secondary text-lg'>
                24.000đ
              </span>
            </div>
            <div className='w-44 h-44 relative bg-primary rounded-xl flex flex-col justify-end items-center pb-4'>
              <Image
                src='/images/watermelon.png'
                className='absolute -top-[30%] left-1/5'
                width={100}
                height={160}
                alt='watermelon'
              />
              <span className='text-white leading-4'>Trà Dưa Hấu</span>
              <span className='font-pacifico text-secondary text-lg'>
                29.000đ
              </span>
            </div>
          </div>
        </div>

        {/* Image */}
        <div>
          <Image
            src='/images/hero-poster.png'
            width={736}
            height={736}
            alt='hero-poster'
            // sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            layout='responsive'
          />
        </div>
      </div>

      {/* About us section */}
      <div className='flex justify-between gap-60 mt-32'>
        <div className='flex flex-col gap-2'>
          <span className='text-5xl text-primary font-bold'>Về SEKAI</span>
          <span className='text-xl text-primary font-medium'>
            SEKAI – HÀNH TRÌNH CHINH PHỤC PHONG VỊ MỚI
          </span>
          <span className='text-lg'>
            Hành trình luôn bắt đầu từ việc chọn lựa nguyên liệu ký cẩn từ các
            vùng đất trù phú, cho đến việc bảo quản, pha chế tỉ mỉ tay nghề
            nhân. Qua những nỗ lực không ngừng, SEKAI luôn hướng đến...
          </span>
          <Button size='lg' color='primary' className='mt-8 self-start'>
            Xem thêm
          </Button>
        </div>
        <Image
          src='/images/about-us-poster.png'
          width={500}
          height={500}
          className='rounded-2xl w-full h-auto flex-1'
          alt='about-us-poster'
        />
      </div>

      {/* Category section */}
      <div className='flex justify-around mt-32 gap-20 mx-auto'>
        <div className='flex flex-col items-center gap-8'>
          <span className='text-3xl font-bold'>Trà trái cây</span>
          <Image
            src='/images/fruit-poster.png'
            width={600}
            height={600}
            className='rounded-2xl w-full h-auto flex-1'
            alt='fruit-poster'
          />
        </div>
        <div className='flex flex-col items-center gap-8'>
          <span className='text-3xl font-bold'>Trà sữa</span>
          <Image
            src='/images/milk-tea-poster.png'
            width={600}
            height={600}
            className='rounded-2xl w-full h-auto flex-1'
            alt='milk-tea-poster'
          />
        </div>
        <div className='flex flex-col items-center gap-8'>
          <span className='text-3xl font-bold'>Ăn vặt</span>
          <Image
            src='/images/btt-poster.png'
            width={600}
            height={600}
            className='rounded-2xl w-full h-auto flex-1'
            alt='btt-poster'
          />
        </div>
      </div>
    </main>
  )
}
