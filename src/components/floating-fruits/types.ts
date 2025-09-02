export type FloatingFruitsProps = {
  currentJuice: string
  nextJuice: string | null
  isTransitioning: boolean
}

export type FruitPosition =
  | 'topLeft'
  | 'bottomLeft'
  | 'topRight'
  | 'bottomRight'

export type FruitConfig = {
  position: FruitPosition
  size: number
  flipX: number
  zIndex: number
  offsetX: string
  offsetY: string
  blurAmount: number
  rotation: string
  mobile?: boolean
}
