'use client'
import { User } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import AccountDropdown from '@/components/layout/header/account-dropdown'
import LocaleSwitcher from '@/components/layout/header/locale-switcher'
import MobileMenu from '@/components/layout/header/mobile-menu'

export interface NavItem {
  label: string
  href?: string
}

export interface NavBarProps {
  logo: string
  navItems: NavItem[]
  cartItemCount: number
  bgColor?: string
  textColor?: string
  themeColor?: string
  buttonTextColor?: string
}

export default function NavBar({
  logo,
  navItems,
  cartItemCount,
  textColor = 'white',
  bgColor = 'transparent',
  themeColor = '#82AF38',
}: NavBarProps) {
  const [activeDropdown, setActiveDropdown] = useState<
    'cart' | 'account' | 'menu' | null
  >(null)
  const cartRef = useRef<HTMLDivElement>(null)
  const accountRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  // Check for mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 600)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Element

      // Check if clicking on dropdown buttons
      const clickingDropdownButton = target.closest('[data-dropdown]')
      if (clickingDropdownButton) {
        const buttonType = clickingDropdownButton.getAttribute('data-dropdown')
        // If clicking cart/account from menu, don't close menu
        if (
          activeDropdown === 'menu' &&
          (buttonType === 'cart' || buttonType === 'account')
        ) {
          return
        }
      }

      // Check each dropdown separately
      if (
        activeDropdown === 'cart' &&
        cartRef.current &&
        !cartRef.current.contains(target)
      ) {
        setActiveDropdown(null)
      }

      if (
        activeDropdown === 'account' &&
        accountRef.current &&
        !accountRef.current.contains(target)
      ) {
        setActiveDropdown(null)
      }

      if (
        activeDropdown === 'menu' &&
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        setActiveDropdown(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [activeDropdown])

  // Toggle dropdown visibility
  const toggleDropdown = (dropdown: 'cart' | 'account' | 'menu') => {
    setActiveDropdown((prev) => {
      // If clicking the same dropdown that's already open, close it
      if (prev === dropdown) return null

      return dropdown
    })
  }

  return (
    <div
      className='flex w-full max-w-[1440px] items-center justify-between pt-6 ps-[6.2%] pe-[5.5%] py-3 z-[999] select-none mx-auto'
      style={{
        backgroundColor: bgColor,
        backdropFilter: 'blur(2px)',
        transition: 'background-color 0.3s ease',
      }}
    >
      {/* Logo */}
      <div
        className='text-2xl uppercase font-bold cursor-default'
        style={{
          color: textColor,
          fontWeight: 900,
        }}
      >
        {logo}
      </div>

      {/* Navigation Links - Desktop */}
      <div className='hidden space-x-8 md:flex xl:space-x-20'>
        {navItems.map((item, index) => (
          <span
            key={index}
            className='text-base font-normal cursor-pointer relative group'
            style={{ color: textColor }}
          >
            {item.label}
            <span
              className='absolute left-0 bottom-0 w-0 h-[2px] group-hover:w-full transition-all duration-300'
              style={{ backgroundColor: textColor }}
            />
          </span>
        ))}
      </div>

      {/* Mobile Menu */}
      {isMobile && (
        <div ref={menuRef}>
          <MobileMenu
            navItems={navItems}
            cartItemCount={cartItemCount}
            themeColor={themeColor}
            textColor={textColor}
            activeDropdown={activeDropdown}
            toggleDropdown={toggleDropdown}
          />
        </div>
      )}

      {/* User and Cart Icons - Desktop */}
      <div className={`${isMobile ? 'hidden' : 'flex'} items-center space-x-4`}>
        {/* Account Icon with Dropdown */}
        <div ref={accountRef} className='relative'>
          <span
            className='cursor-pointer hover:opacity-80 transition-opacity duration-300'
            style={{ color: textColor }}
            onClick={() => toggleDropdown('account')}
          >
            <User size={20} />
          </span>

          {/* Account Dropdown Menu - Desktop */}
          {!isMobile && activeDropdown === 'account' && (
            <AccountDropdown themeColor={themeColor} isDesktop={true} />
          )}
        </div>
        <LocaleSwitcher />
      </div>
    </div>
  )
}
