import { Card, CardBody, CardFooter } from '@heroui/react'
import Image from 'next/image'

import { ICategory } from '@/types/category'

interface CategoryItemProps {
  category: ICategory
  isActive?: boolean
  onCategoryClick: (category: ICategory) => void
}

export default function CategoryItem({
  category,
  isActive,
  onCategoryClick,
}: CategoryItemProps) {
  return (
    <Card
      onClick={() => onCategoryClick(category)}
      isPressable
      className={`text-sm w-26 ${isActive && 'border-2 border-primary/60 bg-primary-50 text-primary'}`}
    >
      <CardBody className='p-5 px-7 pb-0 items-center justify-center flex'>
        <Image
          alt={`${category?.name} image`}
          className='object-cover rounded-xl h-12 w-8'
          src={category?.image_url}
          width={32}
          height={48}
        />
      </CardBody>
      <CardFooter className='justify-center p-3'>{category?.name}</CardFooter>
    </Card>
  )
}
