import Image from 'next/image'
import { useRef } from 'react'

import { juiceCans, positionConfigs } from './juiceData'

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
          className={`${positionConfigs[index].className} flex items-center justify-center overflow-hidden`}
          style={{
            transformOrigin: positionConfigs[index].transformOrigin,
            willChange: 'transform',
          }}
          ref={(el) => {
            canModelsRef.current[index] = el
          }}
        >
          {/* <CanvasContainer
            modelPath={can.model}
            rotation={positionConfigs[index].rotation}
            isMobile={isMobile}
            isActivePosition={index === activeIndex}
            onLoaded={onActiveModelLoaded}
          /> */}
          <Image
            src={can.model}
            alt={can.name}
            width={isMobile ? 160 : 260}
            height={isMobile ? 160 : 260}
            className='object-contain'
            onLoadingComplete={() => {
              if (index === activeIndex) {
                onActiveModelLoaded()
              }
            }}
          />
        </div>
      ))}
    </div>
  )
}
