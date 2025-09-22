'use client'

import { useEffect, useState } from 'react'

import Header from '@/components/layout/header'

import AboutUsSection from '@/elements/home/about-us-section'
import CategorySection from '@/elements/home/category-section'
import HeroSection, { JuiceData } from '@/elements/home/hero-section'

export const juiceData = [
  {
    title: 'Lemon Ginger',
    description:
      'A zesty and refreshing blend with a spicy kick. Our Lemon Ginger juice combines the citrusy brightness of fresh lemons with the warming properties of ginger.',
    mainBgColor: '#82AF38',
    blurColor: '#E5F985',
    textColor: 'white',
    accentColor: 'rgba(255, 255, 255, 0.9)',
    buttonBgColor: 'white',
    buttonTextColor: '#82AF38',
  },
  {
    title: 'Blueberry Açai',
    description:
      'A nutrient-packed superfood blend. Our Blueberry Açai juice brings together antioxidant-rich berries with the exotic taste of açai for a delicious health boost.',
    mainBgColor: '#385dd2',
    blurColor: '#B6B6F9',
    textColor: 'white',
    accentColor: 'rgba(255, 255, 255, 0.9)',
    buttonBgColor: 'white',
    buttonTextColor: '#385dd2',
  },
  {
    title: 'Mango Burst',
    description:
      'A tropical explosion of sweetness. Our Mango Burst juice captures the sun-ripened goodness of premium mangoes for a taste of paradise in every sip.',
    mainBgColor: '#FFA500',
    blurColor: '#FFF3B6',
    textColor: '#222',
    accentColor: 'rgba(0,0,0,0.7)',
    buttonBgColor: 'white',
    buttonTextColor: '#FFA500',
  },
  {
    title: 'Raspberry Rosé',
    description:
      'An elegant and sophisticated blend. Our Raspberry Rosé juice combines the delicate sweetness of raspberries with subtle floral notes for a refined exp.',
    mainBgColor: '#FF6B81',
    blurColor: '#FFD6DE',
    textColor: 'white',
    accentColor: 'rgba(255,255,255,0.9)',
    buttonBgColor: 'white',
    buttonTextColor: '#FF6B81',
  },
]

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
    // if (Object.keys(juiceData).includes(name)) {
    //   const typedCanName = name as JuiceName
    //   setCurrentJuiceData(juiceData[typedCanName])
    // }
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
