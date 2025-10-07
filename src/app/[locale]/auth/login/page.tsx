import { Card } from '@heroui/react'
import { Metadata } from 'next'

import { LoginForm } from '@/app/[locale]/auth/login/login-form'
export const metadata: Metadata = {
  title: {
    default: 'Login',
    template: `%s`,
  },
  robots: { index: true, follow: true },
}

export default function LoginPage() {
  return (
    <div className='min-h-screen bg-background flex items-center justify-center'>
      <Card>
        <div className='flex items-center justify-center p-8 lg:p-12'>
          <LoginForm />
        </div>
      </Card>
    </div>
  )
}
