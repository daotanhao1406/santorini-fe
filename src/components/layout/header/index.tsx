'use client'

import { Badge } from '@heroui/badge'
import {
  Calendar,
  Coffee,
  Flame,
  Gift,
  ShoppingCart,
  User,
  UserRound,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { useIsMobile } from '@/hooks/use-media-query'

const NavBar = () => {
  const isMobile = useIsMobile()

  const leftNavItems = [
    {
      name: 'trang chủ',
      href: '/',
    },
    {
      name: 'menu',
      href: '/menu',
    },
    {
      name: 'phần thưởng',
      href: '/rewards',
    },
  ]
  const rightNavItems = [
    {
      name: 'về chúng tôi',
      href: '/about-us',
    },
    {
      name: 'liên hệ',
      href: '/contact',
    },
  ]

  if (isMobile) {
    return <MobileNavigation />
  }

  return (
    <nav className='bg-primary text-white rounded-full px-8 py-4 max-w-3xl w-full mx-auto'>
      <div className='flex items-center relative'>
        {/* Left Navigation Items */}

        <div className='flex items-center space-x-8'>
          {leftNavItems.map((item) => (
            <Link key={item.name} href={item.href}>
              <button
                className='uppercase font-semibold text-xs tracking-wider hover:text-gold duration-300 cursor-pointer'
                data-testid='button-trending'
              >
                {item.name}
              </button>
            </Link>
          ))}
        </div>

        {/* Centered Circular Logo */}
        <div className='absolute left-1/2 transform -translate-x-1/2 -translate-y-1'>
          <Link href='/'>
            <div
              className='w-20 h-20 bg-primary rounded-full flex flex-col items-center justify-center cursor-pointer transition-transform duration-300'
              data-testid='button-logo'
            >
              <Image
                alt='Santorini logo'
                src='/svg/logo.svg'
                width={60}
                height={60}
              />
            </div>
          </Link>
        </div>
        <div className='w-32' />
        {/* Right Navigation Items */}
        <div className='flex items-center space-x-8'>
          {rightNavItems.map((item) => (
            <Link key={item.name} href={item.href}>
              <button
                className='uppercase font-semibold text-xs tracking-wider hover:text-gold duration-300 cursor-pointer'
                data-testid='button-trending'
              >
                {item.name}
              </button>
            </Link>
          ))}
          <div className='flex items-center space-x-6'>
            <Badge
              color='secondary'
              content={5}
              shape='rectangle'
              size='sm'
              showOutline={false}
              variant='shadow'
            >
              <ShoppingCart className='cursor-pointer' size={18} />
            </Badge>
            <UserRound className='cursor-pointer' size={18} />
          </div>
        </div>
      </div>
    </nav>
  )
}

const MobileNavigation = () => {
  return (
    <div className='fixed bottom-4 left-4 right-4 z-50'>
      <div className='bg-coffee-dark rounded-2xl p-4 shadow-lg'>
        <div className='flex justify-around items-center'>
          <Link href='/trending'>
            <button
              className='flex flex-col items-center space-y-1 transition-colors duration-300 hover:text-gold'
              data-testid='button-mobile-trending'
            >
              <Flame className='text-gold' size={20} />
              <span className='text-xs'>HOME</span>
            </button>
          </Link>
          <Link href='/rewards'>
            <button
              className='flex flex-col items-center space-y-1 transition-colors duration-300 hover:text-gold'
              data-testid='button-mobile-rewards'
            >
              <Gift className='text-gold' size={20} />
              <span className='text-xs'>MENU</span>
            </button>
          </Link>
          <Link href='/'>
            <button
              className='flex flex-col items-center space-y-1 transition-colors duration-300 hover:text-gold'
              data-testid='button-mobile-shop'
            >
              <Coffee className='text-gold' size={20} />
              <span className='text-xs'>REWARDS</span>
            </button>
          </Link>
          <Link href='/reserve'>
            <button
              className='flex flex-col items-center space-y-1 transition-colors duration-300 hover:text-gold'
              data-testid='button-mobile-reserve'
            >
              <Calendar className='text-gold' size={20} />
              <span className='text-xs'>ABOUT US</span>
            </button>
          </Link>
          <Link href='/profile'>
            <button
              className='flex flex-col items-center space-y-1 transition-colors duration-300 hover:text-gold'
              data-testid='button-mobile-profile'
            >
              <User className='text-gold' size={20} />
              <span className='text-xs'>CONTACT US</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NavBar
