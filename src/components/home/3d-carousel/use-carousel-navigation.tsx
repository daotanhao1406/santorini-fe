import { useCallback, useEffect, useRef } from 'react'

/**
 * Custom hook to handle keyboard and scroll navigation for the carousel
 *
 * @param handleNext Function to navigate to next item
 * @param handlePrev Function to navigate to previous item
 * @param isAnimating Current animation state to prevent overlapping animations
 * @param isEnabled Whether navigation controls are enabled
 * @param enableScrollNavigation Whether to enable scroll wheel navigation
 */
export function useCarouselNavigation(
  handleNext: () => void,
  handlePrev: () => void,
  isAnimating: boolean,
  isEnabled: boolean,
  enableScrollNavigation: boolean = true,
) {
  // Debounce timer reference
  const scrollTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!isEnabled || isAnimating) return

      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          event.preventDefault()
          handleNext()
          break
        case 'ArrowLeft':
        case 'ArrowUp':
          event.preventDefault()
          handlePrev()
          break
      }
    },
    [handleNext, handlePrev, isAnimating, isEnabled],
  )

  // Handle scroll navigation with debounce
  const handleWheel = useCallback(
    (event: WheelEvent) => {
      if (!isEnabled || isAnimating || !enableScrollNavigation) return

      // Clear any existing timer
      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current)
      }

      // Set a new debounce timer
      scrollTimerRef.current = setTimeout(() => {
        const delta = event.deltaY

        if (delta > 20) {
          handleNext()
        } else if (delta < -20) {
          handlePrev()
        }
      }, 150) // Debounce threshold
    },
    [handleNext, handlePrev, isAnimating, isEnabled, enableScrollNavigation],
  )

  // Set up event listeners
  useEffect(() => {
    if (isEnabled) {
      window.addEventListener('keydown', handleKeyDown)

      if (enableScrollNavigation) {
        window.addEventListener('wheel', handleWheel, { passive: true })
      }

      return () => {
        window.removeEventListener('keydown', handleKeyDown)

        if (enableScrollNavigation) {
          window.removeEventListener('wheel', handleWheel)
        }

        if (scrollTimerRef.current) {
          clearTimeout(scrollTimerRef.current)
        }
      }
    }
  }, [handleKeyDown, handleWheel, isEnabled, enableScrollNavigation])
}
