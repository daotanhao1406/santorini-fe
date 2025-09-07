'use client'

import { Button } from '@heroui/button'
import Image from 'next/image'

export default function AboutUsSection() {
  return (
    <div className='flex flex-col lg:flex-row gap-20 mt-32 w-full px-10'>
      <div className='flex flex-col gap-2 lg:w-1/2 w-full'>
        <span className='text-5xl font-bold'>About JUICY</span>
        <span className='text-xl font-medium'>
          JUICY – A JOURNEY TO DISCOVER NEW FLAVORS
        </span>
        <span className='text-lg'>
          The journey always begins with carefully selecting ingredients from
          fertile lands, followed by meticulous preservation and skillful
          preparation. Through continuous efforts, JUICY always strives
          toward...
        </span>
        <Button size='lg' color='primary' className='mt-8 self-start'>
          See more
        </Button>
      </div>
      <div className='lg:w-1/2 w-full flex lg:justify-end mx-auto'>
        <Image
          src='/images/about-us-poster.png'
          width={500}
          height={500}
          className='rounded-2xl h-auto w-full'
          alt='about-us-poster'
        />
      </div>
    </div>
  )
}
