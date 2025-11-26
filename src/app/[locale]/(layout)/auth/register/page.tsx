import { Card } from '@heroui/react'

import { RegisterForm } from '@/app/[locale]/(layout)/auth/register/register-form'

export default function RegisterPage() {
  return (
    <div className='flex h-full items-center justify-center py-8'>
      <Card>
        <div className='flex items-center justify-center p-8 lg:p-10'>
          <RegisterForm />
        </div>
      </Card>
    </div>
  )
}
