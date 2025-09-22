'use client'

import { useEffect, useState } from 'react'

import Header from '@/components/layout/header'

import { JuiceData, juiceData } from '@/constant/juiceData'
import AboutUsSection from '@/elements/home/about-us-section'
import CategorySection from '@/elements/home/category-section'
import HeroSection from '@/elements/home/hero-section'

export default function HomePage() {
  const [isOutOfHeroSection, setIsOutOfHeroSection] = useState<boolean>(false)
  const [currentJuiceData, setCurrentJuiceData] = useState<JuiceData>({
    title: 'Lemon Ginger',
    description:
      'A zesty and refreshing blend with a spicy kick. Our Lemon Ginger juice combines the citrusy brightness of fresh lemons with the warming properties of ginger.',
    mainBgColor: '#82AF38',
    blurColor: '#E5F985',
    textColor: 'white',
    accentColor: 'rgba(255, 255, 255, 0.9)',
    buttonBgColor: 'white',
    buttonTextColor: '#82AF38',
  })

  const handleChangeJuiceData = (name: string) => {
    if (name === currentJuiceData.title) return

    const juice = juiceData.find((juice) => juice.title === name)
    if (juice) {
      setCurrentJuiceData(juice)
    }
  }

  useEffect(() => {
    const hero = document.querySelector('#hero-section')
    if (!hero) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsOutOfHeroSection(!entry.isIntersecting)
      },
      { threshold: 0.2 },
    )

    observer.observe(hero)
    return () => observer.disconnect()
  }, [])
  return (
    <div className='flex-1 font-montserrat'>
      <Header
        isOutOfHeroSection={isOutOfHeroSection}
        bgColor={currentJuiceData.mainBgColor}
      />
      <div className='w-full max-w-[1440px] mx-auto min-[1441px]:max-w-full'>
        <HeroSection
          currentJuiceData={currentJuiceData}
          onChangeJuiceData={handleChangeJuiceData}
        />
      </div>
      <div className='max-w-[1440px] mx-auto'>
        <AboutUsSection />
        <CategorySection />
      </div>
    </div>
  )
}
