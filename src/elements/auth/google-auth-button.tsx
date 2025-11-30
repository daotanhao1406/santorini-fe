'use client'

import { Button } from '@heroui/react'
import { addToast } from '@heroui/react'
import Image from 'next/image'
import { useState } from 'react'

import { createClient } from '@/lib/supabase/client'
import { getSiteURL } from '@/lib/utils'

export default function GoogleAuthButton({
  text = 'Sign in with Google',
}: {
  text?: string
}) {
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async () => {
    try {
      setIsLoading(true)
      const supabase = createClient()

      // Logic chính nằm ở đây
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // Redirect về route handler để đổi code lấy session
          redirectTo: `${getSiteURL()}/auth/callback`,
          queryParams: {
            // access_type: 'offline' // Nếu bạn cần refresh token lâu dài
            prompt: 'consent', // Luôn hiện bảng chọn tài khoản (tránh tự login sai acc)
          },
        },
      })

      if (error) throw error

      // Lưu ý: Với OAuth, code sẽ không chạy tiếp xuống dưới đây vì trình duyệt
      // đã redirect sang trang Google.
    } catch (error: unknown) {
      addToast({
        title: 'Google Login Failed',
        description:
          error instanceof Error ? error.message : 'An error occurred',
        color: 'danger',
      })
      setIsLoading(false)
    }
  }

  return (
    <Button
      isLoading={isLoading}
      onPress={handleLogin}
      color='default'
      variant='solid'
      className='w-full font-semibold'
    >
      {!isLoading && (
        <Image src='/svg/google.svg' alt='Google' width={22} height={22} />
      )}
      {text}
    </Button>
  )
}
