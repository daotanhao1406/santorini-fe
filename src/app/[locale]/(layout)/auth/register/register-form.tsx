'use client'
import { addToast, Button, Form, Input } from '@heroui/react'
import { Eye, EyeOff, KeyRound, MailIcon, UserRound } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

import { createClient } from '@/lib/supabase/client'

import { MyButton } from '@/components/ui/button'
import Typography from '@/components/ui/typography'

export const RegisterForm = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errors, setErrors] = useState({})

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
      const { data, error } = await supabase.auth.signUp({
        email: formData.email as string,
        password: formData.password as string,
        options: {
          data: {
            full_name: formData.fullName,
          },
          // Chỉ dùng cách này bên trong useEffect hoặc event handler (onClick, onSubmit)
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error

      if (!data.session) {
        // THAY ĐỔI Ở ĐÂY: Redirect sang trang verify
        router.push('/auth/verify-email')
      } else {
        // Trường hợp auto confirm (nếu có)
        router.push(continueUrl)
      }
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
    <div className='w-full space-y-6'>
      <div className='space-y-2 min-w-sm flex flex-col'>
        <Typography size='xl' className='font-semibold'>
          Sign Up
        </Typography>
        <Typography size='sm'>
          Create your account to start shopping with us.
        </Typography>
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
        <div className='py-2'>
          <div className='relative text-foreground-400'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-border'></div>
            </div>
            <div className='relative flex justify-center text-xs uppercase'>
              <span className='bg-white px-4'>OR</span>
            </div>
          </div>
        </div>
        <Form
          validationErrors={errors}
          onSubmit={handleSubmit}
          className='w-full items-stretch'
          autoComplete='off'
        >
          <div className='space-y-12'>
            <Input
              label='Full name'
              isRequired
              name='fullName'
              type='fullName'
              variant='bordered'
              labelPlacement='outside'
              placeholder='Enter your full name'
              startContent={
                <UserRound
                  size={20}
                  className='text-xl text-default-400 pointer-events-none shrink-0'
                />
              }
              errorMessage={({ validationDetails }) => {
                if (validationDetails.valueMissing) {
                  return 'Please enter your full name'
                }
              }}
            />

            {/* <Input
              label={
                <div className='text-content4-foreground font-medium content-stretch'>
                  Phone number
                </div>
              }
              name='phoneNumber'
              type='tel'
              errorMessage={({ validationDetails }) => {
                if (validationDetails.valueMissing) {
                  return 'Please enter your phone number'
                }
                if (validationDetails.typeMismatch) {
                  return 'Please enter a valid phone number'
                }
              }}
              variant='bordered'
              labelPlacement='outside'
              placeholder='Enter your phone number'
              startContent={
                <Phone
                  size={20}
                  className='text-xl text-default-400 pointer-events-none shrink-0'
                />
              }
            /> */}

            <Input
              isRequired
              label='Email'
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
                <MailIcon
                  size={20}
                  className='text-xl text-default-400 pointer-events-none shrink-0'
                />
              }
            />

            <Input
              isRequired
              label='Password'
              errorMessage={({ validationDetails }) => {
                if (validationDetails.valueMissing) {
                  return 'Please enter your password'
                }
                if (validationDetails.tooShort) {
                  return 'Password must be at least 6 characters long'
                }
              }}
              minLength={6}
              name='password'
              variant='bordered'
              labelPlacement='outside'
              placeholder='Enter your password'
              startContent={
                <KeyRound
                  size={20}
                  className='text-xl text-default-400 pointer-events-none shrink-0'
                />
              }
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
            <Input
              isRequired
              label='Confirm Password'
              validate={(value) => {
                if (value !== password) {
                  return 'Passwords do not match'
                }
              }}
              name='confirmPassword'
              variant='bordered'
              labelPlacement='outside'
              placeholder='Enter your password'
              startContent={
                <KeyRound
                  size={20}
                  className='text-xl text-default-400 pointer-events-none shrink-0'
                />
              }
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
              value={confirmPassword}
              onValueChange={setConfirmPassword}
            />
          </div>

          <Button
            isLoading={isLoading}
            type='submit'
            size='lg'
            color='primary'
            className='w-full mt-4'
          >
            Sign Up
          </Button>
          <Typography className='text-center'>
            Already have an account?{' '}
            <MyButton className='text-primary' variant='linkHover2'>
              <Link href='/auth/login'>Log in here</Link>
            </MyButton>
          </Typography>
        </Form>
      </div>
    </div>
  )
}
