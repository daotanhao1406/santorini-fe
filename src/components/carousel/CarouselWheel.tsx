import { useRef } from 'react'

import CanvasContainer from '@/components/carousel/CanvasContainer'

import { juiceCans, positionConfigs } from './JuiceData'

interface CarouselWheelProps {
  activeIndex: number
  isMobile: boolean
  onActiveModelLoaded: () => void
  wheelRef: React.RefObject<HTMLDivElement>
}

export default function CarouselWheel({
  activeIndex,
  isMobile,
  onActiveModelLoaded,
  wheelRef,
}: CarouselWheelProps) {
  const canModelsRef = useRef<(HTMLDivElement | null)[]>([])

  return (
    <div
      ref={wheelRef}
      className='relative w-full h-full flex items-center justify-center'
      style={{ transformOrigin: 'center center' }}
    >
      {juiceCans.map((can, index) => (
        <div
          key={can.name}
          className={`${positionConfigs[index].className} ${
            isMobile ? 'w-[45%] h-[45%] mx-auto' : 'w-1/2 h-1/2'
          } transform-gpu`}
          style={{
            transformOrigin: positionConfigs[index].transformOrigin,
            willChange: 'transform',
          }}
          ref={(el) => {
            canModelsRef.current[index] = el
          }}
        >
          <CanvasContainer
            modelPath={can.model}
            rotation={positionConfigs[index].rotation}
            isMobile={isMobile}
            isActivePosition={index === activeIndex}
            onLoaded={onActiveModelLoaded}
          />
        </div>
      ))}
    </div>
  )
}
