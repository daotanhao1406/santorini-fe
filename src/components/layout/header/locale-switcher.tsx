'use client'
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@heroui/react'
import { Locale, useLocale } from 'next-intl'
import { useTransition } from 'react'

import { usePathname, useRouter } from '@/i18n/navigation'

export default function LocaleSwitcher() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const pathname = usePathname()
  const currentLocale = useLocale()

  function onSelectChange(key: React.Key) {
    const nextLocale = key as Locale
    startTransition(() => {
      const search = window.location.search
      const hash = window.location.hash
      const path = pathname.startsWith('/') ? pathname : `/${pathname}`

      const newUrl = `${path}${search}${hash}`
      router.replace(newUrl, { locale: nextLocale, scroll: false })
    })
  }

  return (
    <Dropdown
      classNames={{
        base: 'before:bg-default-400',
        content:
          'py-1 px-1 border border-default-400 bg-linear-to-br from-white to-default-400',
      }}
      placement='bottom-end'
    >
      <DropdownTrigger>
        <Avatar
          radius='none'
          alt='vietnamese'
          className='w-6 h-4 rounded-[3px] cursor-pointer'
          src={`/svg/${currentLocale === 'vi' ? 'vn' : 'gb'}.svg`}
          isDisabled={isPending}
        />
      </DropdownTrigger>
      <DropdownMenu
        onAction={onSelectChange}
        aria-label='Locale switcher'
        variant='flat'
      >
        <DropdownItem
          key='vi'
          startContent={
            <Avatar
              radius='none'
              alt='vietnamese'
              className='w-6 h-4 rounded-[3px]'
              src='/svg/vn.svg'
            />
          }
        >
          Tiếng Việt
        </DropdownItem>
        <DropdownItem
          key='en'
          startContent={
            <Avatar
              radius='none'
              alt='english'
              className='w-6 h-4 rounded-[3px]'
              src='/svg/gb.svg'
            />
          }
        >
          English
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}
