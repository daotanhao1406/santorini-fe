'use client'
import { Chip } from '@heroui/react'
import { useTranslations } from 'next-intl'

import Typography from '@/components/ui/typography'

export default function IceLevelSelector({
  value,
  onChange,
}: {
  value: number
  onChange: (value: number) => void
}) {
  const iceTranslation = useTranslations('menu.ice')
  const iceLevels = [
    { level: 3, label: iceTranslation('3') },
    { level: 2, label: iceTranslation('2') },
    { level: 1, label: iceTranslation('1') },
    { level: 0, label: iceTranslation('0') },
  ]
  return (
    <div className='flex gap-3'>
      {iceLevels.map((level, key) => (
        <Chip
          onClick={() => {
            if (typeof onChange === 'function') {
              onChange(level.level)
            }
          }}
          color={level.level === value ? 'primary' : 'default'}
          className={`cursor-pointer transition-colors duration-300 ${level.level !== value && 'hover:bg-default-200'}`}
          key={key}
        >
          <Typography size='sm'> {level.label}</Typography>
        </Chip>
      ))}
    </div>
  )
}
