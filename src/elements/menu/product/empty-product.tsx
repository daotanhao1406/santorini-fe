import { Card, CardBody } from '@heroui/react'
import { PackageSearch } from 'lucide-react'

import Typography from '@/components/ui/typography'

export default function EmptyProduct() {
  return (
    <div className='flex flex-col items-center pt-8 w-full'>
      <Card radius='sm' className='mb-3'>
        <CardBody>
          <PackageSearch />
        </CardBody>
      </Card>
      <Typography className='font-semibold'>No products found</Typography>
      <Typography
        type='secondary'
        size='sm'
        className='w-xs text-center mt-1.5'
      >
        No products were found. Try removing some filters or searching again.
      </Typography>
    </div>
  )
}
