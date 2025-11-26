import { Button } from '@heroui/react'
import { CheckCircle2, MailOpen } from 'lucide-react'
import Link from 'next/link'

import Typography from '@/components/ui/typography'

export default function VerifyEmailPage() {
  return (
    <div className='flex flex-col items-center justify-center min-h-[60vh] text-center px-4 space-y-6'>
      <div className='relative'>
        <div className='absolute inset-0 bg-primary/20 blur-xl rounded-full' />
        <CheckCircle2 size={80} className='text-primary relative z-10' />
      </div>

      <div className='space-y-2 max-w-md'>
        <Typography size='xxl' className='font-bold font-playfair'>
          Check your email
        </Typography>
        <Typography className='text-default-500'>
          We have sent a confirmation link to your email address. Please click
          the link inside to activate your account.
        </Typography>
      </div>

      <div className='flex flex-col gap-3 w-full max-w-xs'>
        <Button
          as={Link}
          href='https://mail.google.com'
          target='_blank'
          color='primary'
          variant='shadow'
          startContent={<MailOpen size={18} />}
        >
          Open Gmail
        </Button>
        <Button as={Link} href='/auth/login' variant='bordered'>
          Back to Login
        </Button>
      </div>
    </div>
  )
}
