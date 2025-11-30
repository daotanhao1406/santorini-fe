'use client'
import { addToast, Button, Divider, Form, Input } from '@heroui/react'
import { Eye, EyeOff, KeyRound, MailIcon } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

import { createClient } from '@/lib/supabase/client'

import { MyButton } from '@/components/ui/button'
import Typography from '@/components/ui/typography'

import { useCartStore } from '@/stores/use-cart-store'

import GoogleAuthButton from '@/elements/auth/google-auth-button'
import { Link } from '@/i18n/navigation'

export const LoginForm = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [password, setPassword] = useState<string>('')
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errors, setErrors] = useState({})
  const loadCartFromServer = useCartStore((s) => s.loadCartFromServer)

  const continueUrl = searchParams.get('continueUrl') || '/'

  const toggleVisibility = () => setIsVisible(!isVisible)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)

    const formData = Object.fromEntries(new FormData(e.currentTarget))
    // Custom validation checks
    if (!formData.email) {
      setErrors({ email: 'Please enter your email' })

      return setIsLoading(false)
    }
    if (!formData.password) {
      setErrors({ password: 'Please enter your password' })

      return setIsLoading(false)
    }
    // Clear errors and submit
    setErrors({})
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email as string,
        password: formData.password as string,
      })
      if (error) throw error
      await fetch('/api/cart/merge', { method: 'POST' })
      await loadCartFromServer()
      router.push(continueUrl)
    } catch (error: unknown) {
      addToast({
        title: 'Login failed',
        description:
          error instanceof Error ? error.message : 'An error occurred',
        color: 'danger',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='w-full max-w-md space-y-6'>
      <div className='space-y-2 min-w-sm flex flex-col'>
        <Typography size='xl' className='font-semibold'>
          Log In
        </Typography>
        <Typography size='sm'>
          Choose from 10,000+ products across 400+ categories
        </Typography>
      </div>

      <div className='space-y-4 flex flex-col'>
        <GoogleAuthButton />
        <div className='py-2 flex items-center justify-center'>
          <Divider className='flex-1' />
          <Typography size='xs' type='secondary' className='px-4'>
            OR
          </Typography>
          <Divider className='flex-1' />
        </div>
        <Form
          validationErrors={errors}
          onSubmit={handleSubmit}
          className='w-full items-stretch'
        >
          <div className='space-y-12'>
            <Input
              label={
                <div className='text-content4-foreground font-medium content-stretch'>
                  Email
                </div>
              }
              size='lg'
              name='email'
              type='email'
              errorMessage='Please enter a valid username'
              variant='bordered'
              labelPlacement='outside'
              placeholder='Enter your email'
              startContent={
                <MailIcon className='text-xl text-default-400 pointer-events-none shrink-0' />
              }
            />

            <Input
              label={
                <div className='text-content4-foreground font-medium'>
                  Password
                </div>
              }
              name='password'
              variant='bordered'
              labelPlacement='outside'
              placeholder='Enter your password'
              startContent={
                <KeyRound className='text-xl text-default-400 pointer-events-none shrink-0' />
              }
              size='lg'
              type={isVisible ? 'text' : 'password'}
              endContent={
                <button
                  aria-label='toggle password visibility'
                  className='focus:outline-solid outline-transparent'
                  type='button'
                  onClick={toggleVisibility}
                >
                  {isVisible ? (
                    <EyeOff className='text-2xl text-default-400 pointer-events-none' />
                  ) : (
                    <Eye className='text-2xl text-default-400 pointer-events-none' />
                  )}
                </button>
              }
              value={password}
              onValueChange={setPassword}
            />
          </div>
          <div className='flex items-center justify-end'>
            <MyButton variant='linkHover2'>Forgot password?</MyButton>
          </div>

          <Button
            isLoading={isLoading}
            type='submit'
            size='lg'
            color='primary'
            className='w-full'
          >
            Login
          </Button>
        </Form>
        <Typography className='text-center -mt-2'>
          Don't have an account?{' '}
          <MyButton className='text-primary' variant='linkHover2'>
            <Link href='/auth/register'>Sign up here</Link>
          </MyButton>
        </Typography>
      </div>
    </div>
  )
}
