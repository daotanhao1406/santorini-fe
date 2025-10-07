import { Button } from '@heroui/react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

export default function AboutUsSection() {
  const aboutTranslation = useTranslations('HomePage.about')
  return (
    <div className='flex flex-col lg:flex-row gap-20 mt-32 w-full px-10'>
      <div className='flex flex-col gap-2 lg:w-1/2 w-full'>
        <span className='text-5xl font-bold'>{aboutTranslation('title')}</span>
        <span className='text-xl font-medium'>
          {aboutTranslation('subtitle')}
        </span>
        <span className='text-lg mt-2'>{aboutTranslation('description')}</span>
        <Button color='primary' className='mt-8 self-start p-8 text-lg'>
          {aboutTranslation('learn_more_button_text')}
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
