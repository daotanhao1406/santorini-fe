import Image from 'next/image'
export default function CategorySection() {
  return (
    <div className='flex flex-col md:flex-row justify-around mt-32 gap-20 px-10'>
      <div className='flex flex-col items-center gap-8'>
        <span className='text-3xl font-bold'>Fruit Tea</span>
        <Image
          src='/images/fruit-poster.png'
          width={600}
          height={600}
          className='rounded-2xl w-full h-auto flex-1'
          alt='fruit-poster'
        />
      </div>
      <div className='flex flex-col items-center gap-8'>
        <span className='text-3xl font-bold'>Milk Tea</span>
        <Image
          src='/images/milk-tea-poster.png'
          width={600}
          height={600}
          className='rounded-2xl w-full h-auto flex-1'
          alt='milk-tea-poster'
        />
      </div>
      <div className='flex flex-col items-center gap-8'>
        <span className='text-3xl font-bold'>Snacks</span>
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
