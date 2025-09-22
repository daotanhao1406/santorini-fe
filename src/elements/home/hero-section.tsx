'use client'
import { useEffect, useState } from 'react'

import AnimatedBackground from '@/components/home/animated-background'
import JuiceCarousel from '@/components/home/juice-carousel'
import ProductInfo from '@/components/home/product-info'
import ProductLogo from '@/components/home/product-logo'
import ScrollDownButton from '@/components/home/scroll-down-button'

import { JuiceData, juiceData } from '@/constant/juiceData'

interface HeroSectionProps {
  currentJuiceData: JuiceData
  onChangeJuiceData: (canName: string) => void
}

export default function HeroSection({
  currentJuiceData,
  onChangeJuiceData,
}: HeroSectionProps) {
  const [isMobile, setIsMobile] = useState(false)

  // Check for mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 600)
    }

    // Set initial value
    checkMobile()

    // Add resize listener
    window.addEventListener('resize', checkMobile)

    // Cleanup listener
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Callback for JuiceCarousel with debounce to prevent rapid changes
  const handleCanChange = (canName: string) => {
    // Type check to ensure canName is a valid key in canThemeMap

    if (typeof onChangeJuiceData === 'function') {
      onChangeJuiceData(canName)
    }
  }

  return (
    <div
      id='hero-section'
      style={{
        position: 'relative',
        minHeight: '110vh',
        // background: `linear-gradient(to bottom, ${theme.mainBgColor} 70%, #f9f9fb 100%)`,
        transition: '0.6s ease-in-out',
      }}
      className='relative w-full max-h-screen sm:max-h-900px h-[100dvh] select-none mx-auto'
    >
      <div className='absolute inset-0'>
        {juiceData.map((juice, index) => (
          <div
            key={index}
            className='absolute inset-0 transition-opacity duration-1000 ease-in-out'
            style={{
              background: `linear-gradient(to bottom, ${juice.mainBgColor} 70%, #f9f9fb 100%)`,
              opacity:
                juice.mainBgColor === currentJuiceData.mainBgColor ? 1 : 0,
            }}
          />
        ))}
      </div>

      <div className='max-h-screen sm:max-h-900px h-[90dvh] overflow-hidden w-full relative'>
        {/* Background as a separate component that handles its own animation */}
        <AnimatedBackground
          backgroundColor={currentJuiceData.mainBgColor}
          duration={1}
        />

        <div
          className={`max-w-[1440px] ${
            isMobile ? 'px-4' : 'pr-5 pl-[70px]'
          } h-full w-full max-h-[1080px] m-auto relative flex`}
        >
          {/* ProductLogo always fixed as "JUICY" and always white */}
          <ProductLogo
            isMobile={isMobile}
            text='JUICY'
            color='white'
            className='theme-text font-extrabold'
          />

          {/* Juice Carousel with can change callback */}
          <div
            className={`${
              isMobile ? 'relative' : 'absolute'
            }  top-[46%] -translate-y-1/2 left-1/2 -translate-x-1/2 w-full h-full z-0`}
          >
            <JuiceCarousel
              onCanChange={handleCanChange}
              enableScrollNavigation={false}
            />
          </div>

          <ProductInfo juiceData={currentJuiceData} />

          <ScrollDownButton
            firstLine='Get'
            secondLine='This'
            textColor='white'
            isMobile={isMobile}
            themeColor={currentJuiceData.mainBgColor}
          />
        </div>
      </div>
    </div>
  )
}
