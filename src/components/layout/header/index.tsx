import { Button } from '@heroui/button'
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from '@heroui/navbar'
import { ClipboardList, House, Mails, Newspaper, Users } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'

import LocaleSwitcher from '@/components/layout/header/locale-switcher'

interface NavbarProps {
  isOutOfHeroSection?: boolean
  bgColor?: string
}

export default function Header({ isOutOfHeroSection, bgColor }: NavbarProps) {
  const navbarTranslate = useTranslations('HomePage.nav')
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const menuItems = [
    {
      label: navbarTranslate('home'),
      href: '/',
      icon: <House size={18} />,
    },
    {
      label: navbarTranslate('news'),
      href: '/news',
      icon: <Newspaper size={18} />,
    },
    {
      label: navbarTranslate('menu'),
      href: '/menu',
      icon: <ClipboardList size={18} />,
    },
    {
      label: navbarTranslate('about'),
      href: '/about',
      icon: <Users size={18} />,
    },
    {
      label: navbarTranslate('contact'),
      href: '/contact',
      icon: <Mails size={18} />,
    },
  ]

  const navbarBgColor = useMemo(() => {
    if (isMenuOpen) return ''
    if (isOutOfHeroSection) return ''
    return bgColor
  }, [isMenuOpen, isOutOfHeroSection, bgColor])

  const navbarTextColor = useMemo(() => {
    if (isMenuOpen) return 'black'
    if (isOutOfHeroSection) return 'black'
    return 'white'
  }, [isMenuOpen, isOutOfHeroSection])

  return (
    <Navbar
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      maxWidth='xl'
      isBlurred={false}
      isBordered={isOutOfHeroSection}
      className={`transition-colors duration-1000 ease-in-out ${isOutOfHeroSection ? 'bg-background' : ''}`}
      style={{ backgroundColor: navbarBgColor, color: navbarTextColor }}
    >
      <NavbarBrand>
        <div className='text-2xl font-black uppercase cursor-default'>
          JUICY
        </div>
      </NavbarBrand>
      <NavbarContent className='hidden sm:flex ' justify='end'>
        {menuItems.map((item, index) => (
          <NavbarItem className='ml-8 xl:px-6' key={`${item.label}-${index}`}>
            <Link className='font-medium relative group ' href='#'>
              {item.label}
              <span
                className={`absolute ${isOutOfHeroSection ? 'bg-black' : 'bg-white'} left-0 -bottom-[2px] w-0 h-[1px] group-hover:w-full transition-all duration-300`}
              />
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>
      <NavbarContent justify='end'>
        <NavbarItem>
          <LocaleSwitcher />
        </NavbarItem>
        <NavbarItem className='sm:hidden'>
          <NavbarMenuToggle />
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu>
        <Button variant='bordered' color='primary'>
          Sign In / Sign Up
        </Button>
        <div className='mt-2'>
          {menuItems.map((item, index) => (
            <NavbarMenuItem className='py-1' key={`${item}-${index}`}>
              <Link
                className='w-full font-semibold flex items-center gap-3 text-medium'
                href='#'
              >
                {item.icon} {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </Navbar>
  )
}
