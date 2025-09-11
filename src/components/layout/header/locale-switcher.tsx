'use client'
import { Avatar } from '@heroui/avatar'
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@heroui/dropdown'
import { useParams } from 'next/navigation'
import { Locale, useLocale } from 'next-intl'
import { useTransition } from 'react'

import { usePathname, useRouter } from '@/i18n/navigation'

export default function LocaleSwitcher() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const pathname = usePathname()
  const params = useParams()
  const currentLocale = useLocale()

  function onSelectChange(key: React.Key) {
    const nextLocale = key as Locale
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        { pathname, params },
        { locale: nextLocale },
      )
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
          isDisabled={isPending}
          radius='none'
          as='button'
          alt={currentLocale}
          className='w-6 h-4 rounded-[3px] hover:cursor-pointer'
          src={`https://flagcdn.com/${currentLocale === 'vi' ? 'vn' : 'gb'}.svg`}
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
              src='https://flagcdn.com/vn.svg'
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
              src='https://flagcdn.com/gb.svg'
            />
          }
        >
          English
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}
