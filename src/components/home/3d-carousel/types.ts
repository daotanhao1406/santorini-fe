export interface JuiceCan {
  name: string
  color: string
  model: string
  position: string
}

export interface PositionConfig {
  className: string
  transformOrigin: string
  rotation: [number, number, number]
}

export interface Can3DProps {
  modelPath: string
  rotate?: [number, number, number]
  animate?: boolean
  animationSpeed?: number
  oscillationAmplitude?: [number, number, number]
  onLoaded?: () => void
  isMobile?: boolean
}

export interface JuiceCarouselProps {
  onCanChange?: (canName: string) => void
  enableScrollNavigation?: boolean
}

export interface CarouselControlsProps {
  onPrev: () => void
  onNext: () => void
  isAnimating: boolean
  isActiveModelLoaded: boolean
  isMobile: boolean
}
