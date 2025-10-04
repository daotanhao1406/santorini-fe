import { Card, CardBody, CardFooter } from '@heroui/card'
import Image from 'next/image'

import { Category } from '@/types/category'

interface CategoryItemProps {
  category: Category
  isActive?: boolean
  onCategoryClick: (category: Category) => void
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
      className={`text-sm ${isActive && 'border-2 border-primary/60 bg-primary-50 text-primary'}`}
    >
      <CardBody className='p-5 px-7 pb-0 items-center justify-center flex'>
        <Image
          alt={`${category?.name} image`}
          className='object-cover rounded-xl '
          src={category?.image_url}
          width={32}
          height={51}
        />
      </CardBody>
      <CardFooter className='justify-center p-3'>{category?.name}</CardFooter>
    </Card>
  )
}
