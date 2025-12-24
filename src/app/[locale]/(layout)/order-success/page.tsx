import { Button, Card, CardBody } from '@heroui/react'
import { PackagePlus } from 'lucide-react'

import Typography from '@/components/ui/typography'

import { Link } from '@/i18n/navigation'

export default function OrderSuccessPage() {
  return (
    <div className='flex flex-col items-center pt-20 w-full'>
      <Card radius='lg' className='mb-3 p-1'>
        <CardBody>
          <PackagePlus size={36} />
        </CardBody>
      </Card>
      <Typography size='xxl' className='font-semibold mt-2'>
        Thank you for your purchase!
      </Typography>
      <Typography className='text-center mt-4'>
        We're received your order will ship in 15 minutes.
      </Typography>
      <Typography className='w-xs text-center'>
        Your order number is <b>#123456</b>
      </Typography>
      <div className='flex gap-6 mt-6'>
        <Button radius='sm' className='px-8 text-[13px]'>
          View Order
        </Button>
        <Link href='/menu'>
          <Button radius='sm' className='px-8 text-[13px]' color='primary'>
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  )
}
