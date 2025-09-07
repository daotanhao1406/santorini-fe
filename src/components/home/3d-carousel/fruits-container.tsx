import FloatingFruits from '@/components/home/floating-fruits'

interface FruitsContainerProps {
  isVisible: boolean
  currentJuiceType: string
  nextJuiceType: string | null
  isTransitioning: boolean
}

export default function FruitsContainer({
  isVisible,
  currentJuiceType,
  nextJuiceType,
  isTransitioning,
}: FruitsContainerProps) {
  if (!isVisible) return null

  return (
    <div className='absolute w-full h-full inset-0 flex items-center justify-center z-0 pointer-events-none'>
      <FloatingFruits
        currentJuice={currentJuiceType}
        nextJuice={nextJuiceType}
        isTransitioning={isTransitioning}
      />
    </div>
  )
}
