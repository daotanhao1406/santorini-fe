'use client'

import { useEffect } from 'react'

import { createClient } from '@/lib/supabase/client'

import { useUserStore } from '@/stores/use-user-store'

import { useRouter } from '@/i18n/navigation'

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  // Lấy các actions từ store
  const setUser = useUserStore((s) => s.setUser)
  const fetchProfile = useUserStore((s) => s.fetchProfile)
  const setProfile = useUserStore((s) => s.setProfile)

  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()

    // 1. Hàm xử lý logic khi có session
    const handleUserSession = async (session: any) => {
      const user = session?.user ?? null
      setUser(user) // Cập nhật User Metadata vào store

      if (user) {
        // Nếu có user thì đi lấy Profile (điểm, hạng...)
        await fetchProfile()
      } else {
        // Nếu không có user (logout) thì xóa profile
        setProfile(null)
      }
    }

    // 2. Chạy ngay lần đầu mount (để check F5)
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      await handleUserSession(session)
    }
    init()

    // 3. Lắng nghe sự thay đổi (Login, Logout, Token Refreshed)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      // console.log('Auth event:', event) // Debug nếu cần

      if (event === 'SIGNED_OUT') {
        // Xử lý riêng cho logout để clear sạch sẽ
        setUser(null)
        setProfile(null)
        router.refresh() // Refresh để server component (nếu có) cập nhật lại
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        // Token thay đổi hoặc mới đăng nhập -> Cập nhật lại store
        await handleUserSession(session)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [setUser, fetchProfile, setProfile, router])

  return <>{children}</>
}
