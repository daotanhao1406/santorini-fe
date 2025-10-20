'use client'
import { useSearchParams } from 'next/navigation'

import CategoryItem from '@/elements/menu/category/category-item'
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
        <CategoryItem
          onCategoryClick={handleClick}
          key={item.id}
          category={item}
          isActive={item.slug === activeSlug}
        />
      ))}
    </div>
  )
}
