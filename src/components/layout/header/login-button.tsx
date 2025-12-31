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
import { ClipboardList, LogOut, Settings, User as UserIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { useUserStore } from '@/stores/use-user-store'

import { Link, useRouter } from '@/i18n/navigation'

interface LoginButtonProps {
  isOutOfHeroSection?: boolean
}

export default function LoginButton({
  isOutOfHeroSection = true,
}: LoginButtonProps) {
  const router = useRouter()
  const navTranslation = useTranslations('layout.header')
  const { user: userProfile, isLoading, signOut } = useUserStore()

  const iconClasses = 'text-default-700 pointer-events-none shrink-0'

  // --- LOGIC THAY ĐỔI TẠI ĐÂY ---
  // Kiểm tra xem user có phải là ẩn danh không
  const isAnonymous = userProfile?.is_anonymous

  // Nếu chưa có user (đang load) HOẶC là user ẩn danh -> Hiển thị nút Login
  if (!userProfile || isAnonymous) {
    return (
      <Link href='/auth/login'>
        <Button
          isLoading={isLoading}
          color={isOutOfHeroSection ? 'primary' : 'default'}
          variant='solid'
          className='h-9 font-medium'
        >
          {navTranslation('login_button_text') || 'Login'}
        </Button>
      </Link>
    )
  }
  // ------------------------------

  // Phần dưới này chỉ dành cho User thật (Email/Google...)
  return (
    <Dropdown placement='bottom-end'>
      <DropdownTrigger>
        <Avatar
          showFallback={isLoading}
          isBordered={userProfile.user_metadata?.avatar_url ? false : true}
          as='button'
          className='transition-transform cursor-pointer'
          color='secondary'
          // User thật thì mới có full_name trong metadata, còn không thì fallback
          name={
            userProfile.user_metadata?.full_name?.toUpperCase().charAt(0) || 'U'
          }
          size='sm'
          src={userProfile.user_metadata?.avatar_url} // Nếu có avatar google thì hiện luôn
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
          onClick={() => signOut()}
        >
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}
