import { Card, CardBody } from '@heroui/react'
import { Mail } from 'lucide-react'

import Typography from '@/components/ui/typography'

export default function VerifyEmailPage() {
  return (
    <div className='flex flex-col flex-1 h-2/3 min-h-96 items-center justify-center w-full'>
      <Card radius='sm' className='mb-3 bg-transparent'>
        <CardBody>
          <Mail />
        </CardBody>
      </Card>
      <Typography size='xl' className='font-semibold'>
        Check your email
      </Typography>

      <Typography size='md' className='max-w-2/3 text-center mt-1.5'>
        We have sent a confirmation link to your email address. Please click the
        link inside to activate your account.
      </Typography>
    </div>
  )
}
