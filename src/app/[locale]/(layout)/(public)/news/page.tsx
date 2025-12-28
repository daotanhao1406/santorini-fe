import { Button, Divider } from '@heroui/react'
import { CornerDownRight } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

import Typography from '@/components/ui/typography'

const articles = [
  {
    id: 1,
    date: 'APR, 2022',
    title: 'Reduce Co2 emissions to protect nature',
    description:
      'Every October, Co.Bo. celebrates not only its foundation but the ongoing story of innovation, dedication, and craftsmanship that defines who we are.',
    image: '/images/fruit-poster.png',
  },
  {
    id: 2,
    date: 'NOV, 2021',
    title: 'Moving from thought to action at a reduce cost',
    description:
      'Moving from thought to action requires the satisfaction of a series of consecutive steps from which no one can escape.',
    image: '/images/btt-poster.png',
  },
]

export default function NewsPage() {
  return (
    <div className='min-h-screen'>
      {/* Main Content */}
      <main className='pt-8 lg:pt-16 px-8 xl:px-0 pb-20'>
        <div className='flex flex-col lg:flex-row lg:justify-between'>
          {/* Left Side - Typography */}
          <div className='lg:sticky lg:top-24 lg:self-start w-1/2 flex flex-col lg:items-center lg:justify-center xl:items-start'>
            <div className='relative w-[24vw]'>
              <div className='flex flex-col w-full'>
                <h1 className='text-[10vw] leading-[8vw] font-medium'>BL</h1>
                <h1 className='text-[10vw] leading-[8vw] font-medium self-end'>
                  OG-
                </h1>
                <h1 className='text-[10vw] leading-[8vw] font-medium'>NEW</h1>
                <div className='flex items-center'>
                  <h1 className='text-[10vw] leading-[8vw] font-medium'>S</h1>
                  <h1 className='ml-[2vw] text-[2vw] leading-[1.8vw]'>
                    Latest News
                    <br />
                    <span className='ml-[3vw]'>and updates</span>
                  </h1>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Articles */}
          <div className='lg:self-end flex flex-col justify-center items-center w-1/2'>
            {articles.map((article, index) => (
              <div key={index} className='flex flex-col items-end'>
                <article
                  key={article.id}
                  className='flex flex-col md:flex-row gap-7'
                >
                  {/* Image */}
                  <div className='relative aspect-[3/5] md:h-[254px] xl:h-[478px] bg-neutral-900 rounded-md border'>
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className='object-cover rounded-md'
                      sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                    />
                  </div>

                  {/* Content */}
                  <div className='md:w-1/2 flex flex-col justify-between'>
                    <div>
                      {/* <span className='text-[.6vw] leading-[.8vw] font-semibold'>
                        {article.date}
                      </span> */}
                      <Typography size='xs' className='font-semibold'>
                        {article.date}
                      </Typography>

                      <h2 className='text-[2.4vw] leading-[2vw] font-medium pb-[1.5vw] mt-[.6vw]'>
                        {article.title}
                      </h2>

                      {/* <button className='inline-flex items-center gap-3 bg-black text-white px-5 py-2.5 rounded-full text-sm w-fit mb-8 hover:bg-neutral-800 transition-colors text-[13px]'>
                        Discover
                        <CornerDownRight size={13} />
                      </button> */}
                      <Button radius='full' color='primary'>
                        Discover
                        <CornerDownRight size={13} />
                      </Button>
                    </div>
                    {/* <Typography className='text-[.8vw] leading-[1vw] font-medium'>
                      {article.description}
                    </Typography> */}
                    <p className='text-[1vw] leading-[1.2vw] font-medium'>
                      {article.description}
                    </p>
                  </div>
                </article>
                <Divider className='my-[6vw]' />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
