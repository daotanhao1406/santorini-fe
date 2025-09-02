'use client'
import { GitBranchPlus, Link2OffIcon, TableRowsSplitIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface ScrollDownButtonProps {
  firstLine: string
  secondLine: string
  size?: number
  textColor?: string
  hoverBgColor?: string
  themeColor?: string
  isMobile?: boolean
}

export default function ScrollDownButton({
  firstLine,
  secondLine,
  size = 100,
  textColor = 'white',
  themeColor = '#82AF38',
  isMobile,
}: ScrollDownButtonProps) {
  const [showMenu, setShowMenu] = useState(false)
  const buttonRef = useRef<HTMLDivElement>(null)

  const handleClick = () => {
    setShowMenu((prev) => !prev)
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const socialLinks = [
    {
      name: 'Twitter',
      icon: <TableRowsSplitIcon size={isMobile ? 20 : 24} />,
      url: 'https://x.com/mohamed_djoudir',
    },
    {
      name: 'LinkedIn',
      icon: <Link2OffIcon size={isMobile ? 20 : 24} />,
      url: 'https://www.linkedin.com/in/mohamed-djoudir',
    },
    {
      name: 'GitHub',
      icon: <GitBranchPlus size={isMobile ? 20 : 24} />,
      url: 'https://github.com/MohamedDjoudir',
    },
  ]

  const mobileSize = isMobile ? 60 : size
  const mobileFontSize = isMobile ? 'text-xs' : ''

  return (
    <div
      className={`absolute ${
        isMobile
          ? 'bottom-4 right-4'
          : 'bottom-[clamp(2rem,1.8vw,9rem)] right-[clamp(2rem,4.5vw,9rem)]'
      } z-50`}
      ref={buttonRef}
    >
      <button
        className='rounded-full border-1 border-white/50 flex flex-col items-center justify-center transition-all duration-300 bg-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.4)]'
        style={{
          width: `${mobileSize}px`,
          height: `${mobileSize}px`,
          color: textColor,
        }}
        onClick={handleClick}
        onMouseOver={(e) => {
          if (!showMenu) {
            e.currentTarget.style.opacity = '0.8'
          }
        }}
        onMouseOut={(e) => {
          if (!showMenu) {
            e.currentTarget.style.opacity = '1'
          }
        }}
      >
        <span className={`text-shadow-xs ${mobileFontSize}`}>{firstLine}</span>
        <span className={`text-shadow-xs ${mobileFontSize}`}>{secondLine}</span>
      </button>

      {showMenu && (
        <div
          className='absolute bottom-full mb-4 right-0 bg-white bg-opacity-95 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden transform origin-bottom-right transition-all'
          style={{
            animation: 'scaleIn 0.2s ease-out forwards',
            zIndex: 600,
            width: 'auto',
          }}
        >
          <div className='p-3'>
            <h3
              className={`font-semibold mb-2 text-center ${isMobile ? 'text-sm' : ''}`}
              style={{ color: themeColor }}
            >
              Contact me
            </h3>

            <div className='flex gap-2'>
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} flex items-center justify-center rounded-full transition-opacity duration-300`}
                  style={{
                    backgroundColor: themeColor,
                    color: 'white',
                  }}
                  title={link.name}
                  onMouseOver={(e) => {
                    e.currentTarget.style.opacity = '0.8'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.opacity = '1'
                  }}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
