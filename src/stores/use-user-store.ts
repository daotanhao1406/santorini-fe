import { addToast } from '@heroui/react'
import { User } from '@supabase/supabase-js'
import { create } from 'zustand'

import { createClient } from '@/lib/supabase/client'

import { IUserMetadata, IUserProfile } from '@/types/user'

interface IUserState {
  // State
  user: (User & { user_metadata: IUserMetadata }) | null
  profile: IUserProfile | null
  isLoading: boolean
  isAuthenticated: boolean

  // Actions
  setUser: (user: User | null) => void
  setProfile: (profile: IUserProfile | null) => void
  fetchProfile: () => Promise<void>
  signOut: () => Promise<void>

  // Computed values (Getter tiện lợi)
  computed: {
    displayName: string
    avatar: string
    isAdmin: boolean
  }
}

// --- 2. TẠO STORE ---

export const useUserStore = create<IUserState>((set, get) => ({
  user: null,
  profile: null,
  isLoading: true,
  isAuthenticated: false,

  // --- Setters ---
  setUser: (user) => {
    set({
      user: user as (User & { user_metadata: IUserMetadata }) | null,
      isAuthenticated: !!user,
      isLoading: false,
    })
  },

  setProfile: (profile) => set({ profile }),

  // --- Fetch Profile từ DB ---
  fetchProfile: async () => {
    const { user } = get()
    if (!user) return

    const supabase = createClient()
    try {
      // Giả sử bảng tên là 'profiles'
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        // Mã lỗi PGRST116 nghĩa là không tìm thấy dòng nào (User mới chưa có profile)
        // if (error.code !== 'PGRST116') {
        //   console.error('Lỗi khi tải profile:', error.message)
        // }
        return
      }

      if (data) {
        set({ profile: data as IUserProfile })
      }
    } catch (error) {
      addToast({
        title: 'System error when fetch profile:',
        description: (error as Error)?.message || '',
        color: 'danger',
      })
    }
  },

  // --- Đăng xuất ---
  signOut: async () => {
    const supabase = createClient()
    set({ isLoading: true })
    try {
      await supabase.auth.signOut()
      // Reset toàn bộ state về null
      set({
        user: null,
        profile: null,
        isAuthenticated: false,
        isLoading: false,
      })
      // Reload trang để xóa sạch cache của các component khác
      window.location.href = '/'
    } catch (error) {
      addToast({
        title: 'Logout error',
        description: (error as Error)?.message || '',
        color: 'danger',
      })
      set({ isLoading: false })
    }
  },

  // --- Computed Properties ---
  // Lưu ý: Đây là getter object, nó sẽ tính toán dựa trên state hiện tại khi bạn gọi
  get computed() {
    const state = get()
    const metadata = state.user?.user_metadata

    return {
      get displayName() {
        return metadata?.full_name || state.user?.email || 'Khách hàng'
      },
      get avatar() {
        return metadata?.avatar_url || ''
      },
      get isAdmin() {
        // Ví dụ logic check admin
        return metadata?.role === 'admin'
      },
    }
  },
}))
