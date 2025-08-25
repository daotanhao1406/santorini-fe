import { Metadata } from 'next'

import { LoginForm } from '@/app/auth/login/login-form'
import { LoginHero } from '@/app/auth/login/login-hero'
export const metadata: Metadata = {
  title: {
    default: 'Login',
    template: `%s`,
  },
  robots: { index: true, follow: true },
}

export default function LoginPage() {
  return (
    <div className='min-h-screen bg-background'>
      <div className='grid lg:grid-cols-2 min-h-screen'>
        {/* Left side - Login Form */}
        <div className='flex items-center justify-center p-8 lg:p-12'>
          <LoginForm />
        </div>

        {/* Right side - Hero Image */}
        <div className='hidden lg:block'>
          <LoginHero />
        </div>
      </div>
    </div>
  )
}
