import { FruitConfig } from './types'

// Map juice types to fruit images
export const fruitTypeMap: Record<string, string> = {
  'Lemon Ginger': 'lemon.png',
  'Blueberry Açai': 'blueberry.png',
  'Mango Burst': 'mango.png',
  'Raspberry Rosé': 'raspberry.png',
  // Default to lemon for any unknown type
  default: 'lemon.png',
}

// Get the path to the fruit image based on juice type
export function getFruitImagePath(juiceType: string): string {
  const filename = fruitTypeMap[juiceType] || fruitTypeMap.default
  return `/assets/images/fruit/${filename}`
}

// Get the appropriate fruit configs for a juice type
export function getFruitConfigs(isMobile?: boolean): FruitConfig[] {
  // Use the same z-index for all fruits
  const commonZIndex = 20

  // Size adjustments based on device
  const sizeMultiplier = isMobile ? 0.6 : 1 // 40% smaller on mobile

  // Make fruits 3x larger than original but then 20% smaller than that
  const smallSize = 60 * 3 * 0.8 * sizeMultiplier // 120px on desktop, ~72px on mobile
  const largeSize = 100 * 3 * 0.8 * sizeMultiplier // 216px on desktop, ~130px on mobile

  // Position fruits AWAY from the can, not hidden behind it
  return [
    // Top Left - Small
    {
      position: 'topLeft',
      size: smallSize,
      flipX: 1,
      zIndex: commonZIndex,
      offsetX: isMobile ? '-20%' : '-65%',
      offsetY: isMobile ? '35%' : '30%',
      blurAmount: isMobile ? 1.5 : 2, // Reduced blur for mobile
      rotation: 'rotate(150deg)',
    },
    // Bottom Left - Big
    {
      position: 'bottomLeft',
      size: largeSize,
      flipX: 1,
      zIndex: commonZIndex,
      offsetX: isMobile ? '-20%' : '-55%',
      offsetY: isMobile ? '65%' : '70%',
      blurAmount: isMobile ? 0.5 : 0.7, // Reduced blur for mobile
      rotation: 'rotate(165deg)',
    },
    // Top Right - Big
    {
      position: 'topRight',
      size: largeSize,
      flipX: 1,
      zIndex: commonZIndex,
      offsetX: isMobile ? '90%' : '120%',
      offsetY: isMobile ? '30%' : '30%',
      blurAmount: isMobile ? 0.7 : 1, // Reduced blur for mobile
      rotation: 'rotate(-30deg)',
    },
    // Bottom Right - Small
    {
      position: 'bottomRight',
      size: smallSize,
      flipX: 1,
      zIndex: commonZIndex,
      offsetX: isMobile ? '100%' : '120%',
      offsetY: isMobile ? '60%' : '70%',
      blurAmount: isMobile ? 1 : 1.5, // Reduced blur for mobile
      rotation: 'rotate(-15deg)',
    },
  ]
}
