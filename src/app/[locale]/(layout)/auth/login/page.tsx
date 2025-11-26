import { Card } from '@heroui/react'
import { Metadata } from 'next'

import { LoginForm } from '@/app/[locale]/(layout)/auth/login/login-form'

export const metadata: Metadata = {
  title: {
    default: 'Login',
    template: `%s`,
  },
  robots: { index: true, follow: true },
}

export default function LoginPage() {
  return (
    <div className='flex flex-col h-full items-center justify-center py-8'>
      <Card>
        <div className='flex items-center justify-center p-8 lg:p-10'>
          <LoginForm />
        </div>
      </Card>
    </div>
  )
}
