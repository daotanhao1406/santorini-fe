import Image from 'next/image'
import { useTranslations } from 'next-intl'
export default function CategorySection() {
  const categoriesTranslation = useTranslations('HomePage.categories')
  return (
    <div className='flex flex-col md:flex-row justify-around mt-32 gap-20 px-10'>
      <div className='flex flex-col items-center gap-8'>
        <span className='text-3xl font-bold'>
          {categoriesTranslation('fruit_tea')}
        </span>
        <Image
          src='/images/fruit-poster.png'
          width={600}
          height={600}
          className='rounded-2xl w-full h-auto flex-1'
          alt='fruit-poster'
        />
      </div>
      <div className='flex flex-col items-center gap-8'>
        <span className='text-3xl font-bold'>
          {categoriesTranslation('milk_tea')}
        </span>
        <Image
          src='/images/milk-tea-poster.png'
          width={600}
          height={600}
          className='rounded-2xl w-full h-auto flex-1'
          alt='milk-tea-poster'
        />
      </div>
      <div className='flex flex-col items-center gap-8'>
        <span className='text-3xl font-bold'>
          {categoriesTranslation('snacks')}
        </span>
        <Image
          src='/images/btt-poster.png'
          width={600}
          height={600}
          className='rounded-2xl w-full h-auto flex-1'
          alt='btt-poster'
        />
      </div>
    </div>
  )
}
