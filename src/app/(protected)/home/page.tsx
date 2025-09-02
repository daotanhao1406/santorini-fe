import HeroSection from '@/app/(protected)/home/hero-section'

export default function HomePage() {
  return (
    <div>
      <HeroSection />
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
        </div>
      </div>
    </div>
  )
}
