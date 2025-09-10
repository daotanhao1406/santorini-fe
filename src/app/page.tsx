import Footer from '@/components/layout/footer'

import AboutUsSection from '@/elements/home/about-us-section'
import CategorySection from '@/elements/home/category-section'
import HeroSection from '@/elements/home/hero-section'

export default function HomePage() {
  return (
    <div className='flex-1 font-montserrat'>
      <div className='w-full max-w-[1440px] mx-auto min-[1441px]:max-w-full'>
        <HeroSection />
      </div>
      <div className='max-w-[1440px] mx-auto'>
        <AboutUsSection />
        <CategorySection />
      </div>
      <div className='mt-16'>
        <Footer />
      </div>
    </div>
  )
}
