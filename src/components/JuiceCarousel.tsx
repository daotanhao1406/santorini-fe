/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { useGLTF } from '@react-three/drei'
import gsap from 'gsap'
import { useCallback, useEffect, useRef, useState } from 'react'

import {
  CarouselControls,
  CarouselWheel,
  FruitsContainer,
  juiceCans,
  JuiceCarouselProps,
  LoadingIndicator,
  useCarouselNavigation,
} from './carousel'

export default function JuiceCarousel({
  onCanChange,
  enableScrollNavigation = true,
}: JuiceCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const wheelRef = useRef<HTMLDivElement>(null)
  const [currentJuiceType, setCurrentJuiceType] = useState(juiceCans[0].name)
  const [nextJuiceType, setNextJuiceType] = useState<string | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const [isActiveModelLoaded, setIsActiveModelLoaded] = useState(false)
  const [showFruits, setShowFruits] = useState(false)
  const [, setLoadedModels] = useState<Record<string, boolean>>({})
  const [renderDelayComplete, setRenderDelayComplete] = useState(false)
  const [initialLoadComplete, setInitialLoadComplete] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  // Track if this component is in view/active
  const [isInView, setIsInView] = useState(true)

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

  // Track if the component is in the viewport
  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      typeof IntersectionObserver === 'undefined'
    ) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        setIsInView(entry.isIntersecting)
      },
      { threshold: 0.4 }, // Consider in view when 40% visible
    )

    const containerElement = document.querySelector('.juice-carousel-container')
    if (containerElement) {
      observer.observe(containerElement)
    }

    return () => {
      if (containerElement) {
        observer.unobserve(containerElement)
      }
    }
  }, [])

  const markModelAsLoaded = useCallback((modelPath: string) => {
    setLoadedModels((prev) => ({
      ...prev,
      [modelPath]: true,
    }))
  }, [])

  const handleActiveModelLoaded = useCallback(() => {
    const activeCan = juiceCans[activeIndex]
    markModelAsLoaded(activeCan.model)

    setTimeout(() => {
      // Set loading to false first
      setIsLoading(false)
      setIsActiveModelLoaded(true)

      // Mark loading as complete first
      setInitialLoadComplete(true)

      // Set transition state first and show fruits with a delay
      setIsTransitioning(true)

      // Only show fruits after a longer delay to ensure proper animation
      setTimeout(() => {
        setShowFruits(true)
      }, 100)
    }, 100)
  }, [activeIndex, markModelAsLoaded])

  useEffect(() => {
    if (initialLoadComplete) {
      // Only start the delay timer after loading is complete
      const timer = setTimeout(() => {
        setRenderDelayComplete(true)
      }, 300)

      return () => clearTimeout(timer)
    }
  }, [initialLoadComplete])

  useEffect(() => {
    const initialRotation = activeIndex * 90
    gsap.set(wheelRef.current, { rotation: initialRotation })

    setCurrentJuiceType(juiceCans[activeIndex].name)
    if (onCanChange) onCanChange(juiceCans[activeIndex].name)
  }, [])

  const handleNext = useCallback(() => {
    if (isAnimating || !isActiveModelLoaded) return
    setIsAnimating(true)

    const nextIndex = (activeIndex - 1 + juiceCans.length) % juiceCans.length

    setNextJuiceType(juiceCans[nextIndex].name)
    setIsTransitioning(true)
    if (onCanChange) onCanChange(juiceCans[nextIndex].name)

    gsap.to(wheelRef.current, {
      rotation: '+=90',
      duration: 1,
      ease: 'power2.inOut',
      onComplete: () => {
        setActiveIndex(nextIndex)
        setCurrentJuiceType(juiceCans[nextIndex].name)
        setNextJuiceType(null)
        setIsAnimating(false)
      },
    })
  }, [activeIndex, isAnimating, isActiveModelLoaded, onCanChange])

  const handlePrev = useCallback(() => {
    if (isAnimating || !isActiveModelLoaded) return
    setIsAnimating(true)

    const nextIndex = (activeIndex + 1) % juiceCans.length

    setNextJuiceType(juiceCans[nextIndex].name)
    setIsTransitioning(true)
    if (onCanChange) onCanChange(juiceCans[nextIndex].name)

    gsap.to(wheelRef.current, {
      rotation: '-=90',
      duration: 1,
      ease: 'power2.inOut',
      onComplete: () => {
        setActiveIndex(nextIndex)
        setCurrentJuiceType(juiceCans[nextIndex].name)
        setNextJuiceType(null)
        setIsAnimating(false)
      },
    })
  }, [activeIndex, isAnimating, isActiveModelLoaded, onCanChange])

  // Use our custom navigation hook
  useCarouselNavigation(
    handleNext,
    handlePrev,
    isAnimating,
    isInView && isActiveModelLoaded,
    enableScrollNavigation,
  )

  useEffect(() => {
    const modelPaths = juiceCans.map((can) => can.model)

    const initialLoadingState: Record<string, boolean> = {}
    modelPaths.forEach((path) => {
      initialLoadingState[path] = false
    })
    setLoadedModels(initialLoadingState)

    modelPaths.forEach((path) => {
      useGLTF.preload(path)
    })
  }, [])

  return (
    <div className='relative w-full h-full z-50! juice-carousel-container'>
      {/* Loading indicator */}
      <LoadingIndicator isLoading={isLoading} />

      {/* Main carousel content with delay */}
      <div
        className='relative w-full h-full'
        style={{
          opacity: renderDelayComplete ? 1 : 0,
          transition: 'opacity 0.3s ease',
          visibility: renderDelayComplete ? 'visible' : 'hidden',
        }}
      >
        {/* Floating Fruits Component */}
        <FruitsContainer
          isVisible={isActiveModelLoaded && showFruits}
          currentJuiceType={currentJuiceType}
          nextJuiceType={nextJuiceType}
          isTransitioning={isTransitioning}
        />

        <div
          className={`absolute top-0 left-1/2 -translate-x-1/2 
          ${isMobile ? 'translate-y-[1%]' : 'translate-y-[3%]'} 
          w-[300vh] h-[300vh] inset-0 flex items-center justify-center
          `}
        >
          {/* Carousel Wheel Component */}
          <CarouselWheel
            activeIndex={activeIndex}
            isMobile={isMobile}
            onActiveModelLoaded={handleActiveModelLoaded}
            wheelRef={wheelRef as React.RefObject<HTMLDivElement>}
          />
        </div>

        {/* Carousel navigation controls */}
        <CarouselControls
          onPrev={handlePrev}
          onNext={handleNext}
          isAnimating={isAnimating}
          isActiveModelLoaded={isActiveModelLoaded}
          isMobile={isMobile}
        />
      </div>
    </div>
  )
}
