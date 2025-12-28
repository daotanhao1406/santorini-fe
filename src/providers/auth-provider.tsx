'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'

import { createClient } from '@/lib/supabase/client'

import { useCartStore } from '@/stores/use-cart-store'
import { useUserStore } from '@/stores/use-user-store'

import { useRouter } from '@/i18n/navigation'

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const setUser = useUserStore((s) => s.setUser)
  const fetchProfile = useUserStore((s) => s.fetchProfile)
  const setProfile = useUserStore((s) => s.setProfile)

  const syncCart = useCartStore((s) => s.syncCartToServer)
  const loadCart = useCartStore((s) => s.loadCartFromServer)

  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  // Dùng ref để đảm bảo chỉ chạy logic sync 1 lần duy nhất khi mount
  const isSyncingRef = useRef(false)

  useEffect(() => {
    const supabase = createClient()

    const handleUserSession = async (session: any) => {
      const user = session?.user ?? null
      setUser(user)

      if (user && !user.is_anonymous) {
        await fetchProfile()
      } else {
        setProfile(null)
      }
    }

    // Hàm xử lý Sync Cart riêng biệt
    const handleSyncCartIfNeeded = async () => {
      // Điều kiện vàng: Có cờ synccart=true VÀ chưa đang sync
      if (searchParams.get('synccart') === 'true' && !isSyncingRef.current) {
        isSyncingRef.current = true // Lock lại để không chạy 2 lần
        try {
          await syncCart() // Merge Local -> Server
          await loadCart() // Load Server -> Local

          // 2. ✅ XÓA PARAM ÂM THẦM (Silent URL Cleanup)
          // Lấy URL hiện tại trực tiếp từ window để đảm bảo chính xác
          const url = new URL(window.location.href)

          // Xóa param
          url.searchParams.delete('synccart')

          // Thay thế URL trên thanh địa chỉ mà KHÔNG trigger Next.js Router
          // Tham số thứ 3 là URL mới
          window.history.replaceState(null, '', url.toString())
        } finally {
          isSyncingRef.current = false
        }
      }
    }

    const init = async () => {
      // 1. Lấy session hiện tại (quan trọng cho trường hợp vừa redirect về)
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        const { data } = await supabase.auth.signInAnonymously()
        if (data.session) {
          await handleUserSession(data.session)
        }
      } else {
        // Đã có session (User thật từ Google về hoặc F5)
        await handleUserSession(session)

        // 🔥 KIỂM TRA SYNC NGAY TẠI ĐÂY
        // Không chờ onAuthStateChange, vì session đã có sẵn rồi
        await handleSyncCartIfNeeded()
      }
    }

    init()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null)
        setProfile(null)
        router.refresh()
        init()
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        await handleUserSession(session)
        // Vẫn giữ check ở đây phòng trường hợp login SPA (không reload)
        // Nhưng trường hợp Google Redirect sẽ được xử lý bởi hàm init() bên trên rồi
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [
    setUser,
    fetchProfile,
    setProfile,
    router,
    searchParams,
    pathname,
    syncCart,
    loadCart,
  ])

  return <>{children}</>
}
