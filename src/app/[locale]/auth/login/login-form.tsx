'use client'
import { addToast, Button, Checkbox, Form, Input } from '@heroui/react'
import { Eye, EyeOff, KeyRound, MailIcon } from 'lucide-react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

import { createClient } from '@/lib/supabase/client'

import { MyButton } from '@/components/ui/button'

import { useCartStore } from '@/stores/use-cart-store'

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
      <div className='space-y-2'>
        <h1 className='text-2xl font-semibold text-foreground'>Login</h1>
        <p className='text-sm text-content4-foreground'>
          Choose from 10,000+ products across 400+ categories
        </p>
      </div>

      <div className='space-y-4'>
        <Button
          color='default'
          variant='solid'
          className='w-full font-semibold'
        >
          <Image src='/svg/google.svg' alt='Google' width={22} height={22} />
          Sign in with Google
        </Button>
        <div className='pb-6 pt-2'>
          <div className='relative text-foreground-400'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-border'></div>
            </div>
            <div className='relative flex justify-center text-xs uppercase'>
              <span className='bg-background px-4'>OR</span>
            </div>
          </div>
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
              // classNames={{
              //   inputWrapper: 'h-12',
              // }}
              errorMessage={({ validationDetails }) => {
                if (validationDetails.valueMissing) {
                  return 'Please enter your email'
                }
                if (validationDetails.typeMismatch) {
                  return 'Please enter a valid email address'
                }
              }}
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
              // errorMessage={({ validationDetails }) => {
              //   if (validationDetails.valueMissing) {
              //     return 'Please enter your email'
              //   }
              // }}
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
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-2 '>
              <Checkbox name='remember'>Remember me</Checkbox>
            </div>
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
      </div>
    </div>
  )
}
