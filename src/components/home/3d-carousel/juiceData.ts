import { JuiceCan, PositionConfig } from './types'

// Juice can data with 3D model paths
export const juiceCans: JuiceCan[] = [
  {
    name: 'Lemon Ginger',
    color: '#82AF38', // Green
    model: '/assets/images/can/lemon.webp',
    position: 'top', // 12 o'clock
  },
  {
    name: 'Blueberry Açai',
    color: '#6A5ACD', // Purple
    model: '/assets/images/can/blueberry.webp',
    position: 'right', // 3 o'clock
  },
  {
    name: 'Mango Burst',
    color: '#FFA500', // Orange
    model: '/assets/images/can/orange.webp',
    position: 'bottom', // 6 o'clock
  },
  {
    name: 'Raspberry Rosé',
    color: '#FF6B81', // Pink
    model: '/assets/images/can/strawberry.webp',
    position: 'left', // 9 o'clock
  },
]

// Position configurations
export const positionConfigs: PositionConfig[] = [
  {
    className: 'absolute top-28 md:top-0 left-1/2 -translate-x-1/2',
    transformOrigin: 'center center',
  },
  {
    className:
      'absolute top-1/2 right-32 md:right-12 -translate-x-1/2 -translate-y-1/2 rotate-90',
    transformOrigin: 'center center',
  },
  {
    className:
      'absolute bottom-24 md:-bottom-6 left-1/2 -translate-x-1/2  rotate-180',
    transformOrigin: 'center center',
  },
  {
    className:
      'absolute top-1/2 left-32 md:left-12 translate-x-1/2 -translate-y-1/2  rotate-270',
    transformOrigin: 'center center',
  },
]
