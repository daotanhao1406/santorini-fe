'use client'

import {
  Avatar,
  Button,
  cn,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from '@heroui/react'
import { User } from '@supabase/supabase-js'
import { ClipboardList, LogOut, Settings, User as UserIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useState } from 'react'

import { createClient } from '@/lib/supabase/client'

import { useCartStore } from '@/stores/use-cart-store'

import { Link, useRouter } from '@/i18n/navigation'

interface LoginButtonProps {
  isOutOfHeroSection?: boolean
}

export default function LoginButton({
  isOutOfHeroSection = true,
}: LoginButtonProps) {
  const supabase = createClient()
  const router = useRouter()
  const navTranslation = useTranslations('layout.header')
  const [loading, setLoading] = useState<boolean>(true)
  const [userProfile, setUserProfile] = useState<User | null>(null)
  const [error, setError] = useState<string>('')
  const clearCart = useCartStore((state) => state.clearCart)

  const iconClasses = 'text-default-700 pointer-events-none shrink-0'

  const getProfile = useCallback(async () => {
    try {
      setLoading(true)
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (error) {
        setError(error.message)
      }
      if (user) {
        setUserProfile(user)
      }
    } catch {
      setError('Failed to get user profile')
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    getProfile()
  }, [getProfile])

  if (error || !userProfile) {
    return (
      <Link href='/auth/login'>
        <Button
          isLoading={loading}
          variant={isOutOfHeroSection ? 'light' : 'solid'}
          className='h-9 font-medium'
        >
          {navTranslation('login_button_text') || 'Login'}
        </Button>
      </Link>
    )
  }
  return (
    <Dropdown placement='bottom-end'>
      <DropdownTrigger>
        <Avatar
          showFallback={loading}
          isBordered
          as='button'
          className='transition-transform cursor-pointer'
          color='secondary'
          name={userProfile.user_metadata?.full_name?.toUpperCase().charAt(0)}
          size='sm'
        />
      </DropdownTrigger>
      <DropdownMenu aria-label='Profile Actions' variant='flat'>
        <DropdownSection
          showDivider
          classNames={{ divider: '-mb-1 mt-1' }}
          aria-label='Profile'
        >
          <DropdownItem key='name' className='h-14 gap-2 max-w-52'>
            <p className='font-semibold truncate'>
              {userProfile.user_metadata?.full_name || 'Signed in as'}
            </p>
            <p className='font-medium truncate'>{userProfile.email}</p>
          </DropdownItem>
        </DropdownSection>

        <DropdownSection
          showDivider
          classNames={{ divider: '-mb-1 mt-1' }}
          aria-label='Actions'
        >
          <DropdownItem
            startContent={<UserIcon size={16} className={iconClasses} />}
            key='profile'
            classNames={{
              title: 'font-medium',
            }}
            onClick={() => {
              router.push('/profile')
            }}
          >
            View Profile
          </DropdownItem>
          <DropdownItem
            startContent={<ClipboardList size={16} className={iconClasses} />}
            classNames={{
              title: 'font-medium',
            }}
            key='order-history'
          >
            Order History
          </DropdownItem>
          <DropdownItem
            startContent={<Settings size={16} className={iconClasses} />}
            key='settings'
            classNames={{
              title: 'font-medium',
            }}
          >
            Settings
          </DropdownItem>
        </DropdownSection>

        <DropdownItem
          classNames={{
            title: 'font-medium text-danger',
          }}
          startContent={
            <LogOut size={16} className={cn(iconClasses, 'text-danger')} />
          }
          key='logout'
          color='danger'
          onClick={() => {
            supabase.auth.signOut().then(() => {
              clearCart()
              getProfile()
              router.replace('/auth/login')
            })
          }}
        >
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}
