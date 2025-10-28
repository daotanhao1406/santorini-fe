'use client'
import { Chip } from '@heroui/react'
import { useSearchParams } from 'next/navigation'

import Typography from '@/components/ui/typography'

import { useRouter } from '@/i18n/navigation'

import { ICategory } from '@/types/category'

export default function CategoryList({
  items,
  activeSlug,
}: {
  items: ICategory[] | null
  activeSlug?: string
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleClick = (category: ICategory) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('category', category.slug)
    router.push(`?${params.toString()}`)
  }

  if (!Array.isArray(items) || items.length === 0) {
    return <div>There's no categories to display</div>
  }

  return (
    <div className='flex gap-4 lg:gap-8'>
      {items.map((item) => (
        <Chip
          onClick={() => handleClick(item)}
          classNames={{
            content: 'w-28 flex items-center justify-center font-medium',
          }}
          variant={item.slug === activeSlug ? 'solid' : 'bordered'}
          color={item.slug === activeSlug ? 'primary' : 'default'}
          className={`h-9 cursor-pointer transition-colors duration-300 ${item.slug !== activeSlug && 'hover:bg-default-100'}`}
          key={item.id}
        >
          <Typography size='sm'> {item.name}</Typography>
        </Chip>
      ))}
    </div>
  )
}
