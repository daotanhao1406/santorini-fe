'use client'

import { Avatar } from '@heroui/avatar'
import { Button } from '@heroui/button'
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@heroui/dropdown'
import { User } from '@supabase/supabase-js'
import { useCallback, useEffect, useState } from 'react'

import { createClient } from '@/lib/supabase/client'

import { Link } from '@/i18n/navigation'

interface LoginButtonProps {
  isOutOfHeroSection?: boolean
}

export default function LoginButton({
  isOutOfHeroSection = true,
}: LoginButtonProps) {
  const supabase = createClient()
  const [loading, setLoading] = useState<boolean>(true)
  const [userProfile, setUserProfile] = useState<User | null>(null)
  const [error, setError] = useState<string>('')

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
          Login
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
          name={userProfile.email?.toUpperCase().charAt(0)}
          size='sm'
        />
      </DropdownTrigger>
      <DropdownMenu aria-label='Profile Actions' variant='flat'>
        <DropdownItem key='profile' className='h-14 gap-2'>
          <p className='font-semibold'>Signed in as</p>
          <p className='font-semibold'>{userProfile.email}</p>
        </DropdownItem>
        <DropdownItem key='settings'>My Settings</DropdownItem>
        <DropdownItem key='configurations'>Configurations</DropdownItem>
        <DropdownItem key='help_and_feedback'>Help & Feedback</DropdownItem>
        <DropdownItem
          key='logout'
          color='danger'
          onClick={() => {
            supabase.auth.signOut().then(() => {
              getProfile()
            })
          }}
        >
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}
