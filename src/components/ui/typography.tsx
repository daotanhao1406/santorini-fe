'use client'
import { ChevronDown, ChevronUp } from 'lucide-react'
import React, {
  ElementType,
  HTMLAttributes,
  useEffect,
  useRef,
  useState,
} from 'react'

// Định nghĩa các loại props để đảm bảo type-safety
export type TypographySize =
  | 'xs'
  | 'sm'
  | 'base'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | '5xl'
  | '6xl'
  | '7xl'
  | '8xl'
  | '9xl'

export type TypographyEllipsis =
  | boolean
  | {
      rows: number
      expandable?: boolean
    }

interface TypographyProps extends HTMLAttributes<HTMLElement> {
  children: React.ReactNode
  size?: TypographySize
  ellipsis?: TypographyEllipsis
  className?: string
  as?: ElementType
}

const Typography: React.FC<TypographyProps> = ({
  children,
  size = 'base',
  ellipsis = false,
  className = '',
  as: Component = 'p',
  ...props
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  const [canOverflow, setCanOverflow] = useState<boolean>(false)
  const textRef = useRef<HTMLElement | null>(null)

  // Size mapping với responsive design
  const sizeClasses: Record<TypographySize, string> = {
    xs: 'text-xs sm:text-xs md:text-xs lg:text-xs xl:text-xs',
    sm: 'text-sm sm:text-sm md:text-sm lg:text-sm xl:text-sm',
    base: 'text-base sm:text-sm md:text-base lg:text-base xl:text-base',
    lg: 'text-lg sm:text-sm md:text-base lg:text-base xl:text-lg',
    xl: 'text-xl sm:text-sm md:text-base lg:text-lg xl:text-xl',
    '2xl': 'text-2xl sm:text-base md:text-lg lg:text-xl xl:text-2xl',
    '3xl': 'text-3xl sm:text-lg md:text-xl lg:text-2xl xl:text-3xl',
    '4xl': 'text-4xl sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl',
    '5xl': 'text-5xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl',
    '6xl': 'text-6xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl',
    '7xl': 'text-7xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-7xl',
    '8xl': 'text-8xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl',
    '9xl': 'text-9xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl',
  }

  // Xử lý ellipsis
  const isExpandable = typeof ellipsis === 'object' && !!ellipsis.expandable

  // Kiểm tra xem text có bị tràn không để quyết định có hiển thị nút "Xem thêm"
  useEffect(() => {
    if (isExpandable && textRef.current) {
      const element = textRef.current
      // So sánh chiều cao thực tế và chiều cao hiển thị
      const isOverflowing = element.scrollHeight > element.clientHeight
      setCanOverflow(isOverflowing)
    } else {
      setCanOverflow(false)
    }
  }, [children, isExpandable, size, className])

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  const getLineClampStyle = (): React.CSSProperties => {
    if (typeof ellipsis === 'object' && ellipsis.rows > 1 && !isExpanded) {
      return {
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: ellipsis.rows,
        overflow: 'hidden',
      }
    }
    return {}
  }

  const finalClasses = `
    leading-relaxed tracking-wide 
    transition-all duration-300 ease-out
    ${sizeClasses[size] || sizeClasses.base}
    ${ellipsis === true && typeof ellipsis !== 'object' ? 'truncate' : ''}
    ${className}
  `.trim()

  return (
    <div className='typography-wrapper'>
      <Component
        ref={textRef}
        className={finalClasses}
        style={getLineClampStyle()}
        {...props}
      >
        {children}
      </Component>

      {isExpandable && canOverflow && (
        <button
          onClick={toggleExpanded}
          className='
            inline-flex items-center gap-1 mt-2 
            text-sm font-medium text-blue-600 
            hover:text-blue-800 transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 
            rounded-md px-2 py-1 hover:bg-blue-50
            active:scale-95 transform transition-transform
          '
        >
          {isExpanded ? (
            <>
              Thu gọn
              <ChevronUp className='w-4 h-4 transition-transform duration-200' />
            </>
          ) : (
            <>
              Xem thêm
              <ChevronDown className='w-4 h-4 transition-transform duration-200' />
            </>
          )}
        </button>
      )}
    </div>
  )
}

export default Typography
