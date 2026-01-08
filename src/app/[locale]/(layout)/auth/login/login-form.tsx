'use client'
import { addToast, Button, Divider, Form, Input } from '@heroui/react'
import { Eye, EyeOff, KeyRound, MailIcon } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { createClient } from '@/lib/supabase/client'

import { MyButton } from '@/components/ui/button'
import Typography from '@/components/ui/typography'

import { useCartStore } from '@/stores/use-cart-store'

import GoogleAuthButton from '@/elements/auth/google-auth-button'
import { Link, useRouter } from '@/i18n/navigation'

export const LoginForm = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [password, setPassword] = useState<string>('')
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errors, setErrors] = useState({})
  const syncCartToServer = useCartStore((s) => s.syncCartToServer)
  const loadCartFromServer = useCartStore((s) => s.loadCartFromServer)
  const loginTranslations = useTranslations('login')

  const continueUrl = searchParams.get('continueUrl') || '/'

  const toggleVisibility = () => setIsVisible(!isVisible)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)

    const formData = Object.fromEntries(new FormData(e.currentTarget))
    // Custom validation checks
    if (!formData.email) {
      setErrors({ email: loginTranslations('form.email.value_missing_error') })

      return setIsLoading(false)
    }
    if (!formData.password) {
      setErrors({
        password: loginTranslations('form.password.value_missing_error'),
      })

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
      await syncCartToServer()
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
          {loginTranslations('title')}
        </Typography>
        <Typography size='sm'>
          {loginTranslations('subtitle')}
          {/* Choose from 10,000+ products across 400+ categories */}
        </Typography>
      </div>

      <div className='space-y-4 flex flex-col'>
        <GoogleAuthButton text={loginTranslations('sign_in_with_google')} />
        <div className='py-2 flex items-center justify-center'>
          <Divider className='flex-1' />
          <Typography size='xs' type='secondary' className='px-4'>
            {loginTranslations('or')}
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
                  {loginTranslations('form.email.label')}
                </div>
              }
              size='lg'
              name='email'
              type='email'
              errorMessage={loginTranslations('form.email.value_invalid_error')}
              variant='bordered'
              labelPlacement='outside'
              placeholder={loginTranslations('form.password.placeholder')}
              startContent={
                <MailIcon className='text-xl text-default-400 pointer-events-none shrink-0' />
              }
            />

            <Input
              label={
                <div className='text-content4-foreground font-medium'>
                  {loginTranslations('form.password.label')}
                </div>
              }
              name='password'
              variant='bordered'
              labelPlacement='outside'
              placeholder={loginTranslations('form.password.placeholder')}
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
            <MyButton variant='linkHover2'>
              {loginTranslations('forgot_password')}
            </MyButton>
          </div>

          <Button
            isLoading={isLoading}
            type='submit'
            size='lg'
            color='primary'
            className='w-full'
          >
            {loginTranslations('title')}
          </Button>
        </Form>
        <Typography className='text-center -mt-2'>
          {loginTranslations('dont_have_account')}{' '}
          <MyButton className='text-primary' variant='linkHover2'>
            <Link href='/auth/register'>
              {loginTranslations('sign_up_here')}
            </Link>
          </MyButton>
        </Typography>
      </div>
    </div>
  )
}
