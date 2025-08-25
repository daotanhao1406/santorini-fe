import Image from 'next/image'
export const LoginHero = () => {
  return (
    <div className='relative h-full flex items-center justify-center p-8'>
      <Image
        src='/images/milk-tea.jpg'
        alt='Modern leather dining chair'
        fill
      />
    </div>
  )
}
