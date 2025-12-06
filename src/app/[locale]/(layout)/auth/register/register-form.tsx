'use client'
import { addToast, Button, Divider, Form, Input } from '@heroui/react'
import { Eye, EyeOff, KeyRound, MailIcon, Phone, UserRound } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'

import { createClient } from '@/lib/supabase/client'

import { MyButton } from '@/components/ui/button'
import Typography from '@/components/ui/typography'

import GoogleAuthButton from '@/elements/auth/google-auth-button'
import { Link, useRouter } from '@/i18n/navigation'

export const RegisterForm = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

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

    let phoneNumber = formData.phoneNumber as string

    // BƯỚC 1: Sanitize (Làm sạch dữ liệu)
    // Xóa tất cả khoảng trắng, dấu chấm, gạch ngang... chỉ giữ lại số
    // Ví dụ: "090 123-4567" -> "0901234567"
    phoneNumber = phoneNumber.replace(/\D/g, '')

    // BƯỚC 2: Chuẩn hóa về định dạng 10 số (nếu họ nhập 84...)
    if (phoneNumber.startsWith('84')) {
      phoneNumber = '0' + phoneNumber.slice(2)
    }

    // BƯỚC 3: Validate kỹ thuật (Regex cho mạng VN: Viettel, Vina, Mobi, Vietnamobile...)
    // Giải thích Regex:
    // ^0: Bắt đầu bằng số 0
    // [3|5|7|8|9]: Số thứ 2 phải là 3, 5, 7, 8 hoặc 9 (Các đầu số di động hiện tại)
    // [0-9]{8}: Theo sau là 8 chữ số bất kỳ
    const vnPhoneRegex = /(03|05|07|08|09)+([0-9]{8})\b/

    if (phoneNumber.length !== 10) {
      // Validate độ dài sau khi đã làm sạch
      setErrors({ phoneNumber: 'Phone number must be exactly 10 digits' })
      return setIsLoading(false)
    } else if (!vnPhoneRegex.test(phoneNumber)) {
      // Validate đầu số (tránh trường hợp 10 số nhưng là 0123456789)
      setErrors({ phoneNumber: 'Invalid phone number format (Vietnam only)' })
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
            phone_number: phoneNumber,
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

      <div className='space-y-4 flex flex-col'>
        <GoogleAuthButton text='Sign up with Google' />
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

            <Input
              label='Phone number'
              isRequired
              name='phoneNumber'
              type='tel'
              errorMessage={({ validationDetails }) => {
                if (validationDetails.valueMissing) {
                  return 'Please enter your phone number'
                }
                if (validationDetails.typeMismatch) {
                  return 'Please enter a valid phone number'
                }
                return errors?.phoneNumber
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
            />

            <Input
              isRequired
              label='Email'
              name='email'
              type='email'
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
        </Form>
        <Typography className='text-center -mt-2'>
          Already have an account?{' '}
          <MyButton className='text-primary' variant='linkHover2'>
            <Link href='/auth/login'>Log in here</Link>
          </MyButton>
        </Typography>
      </div>
    </div>
  )
}
