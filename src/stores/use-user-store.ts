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

  // isAuthenticated: True nếu có user (kể cả Guest).
  // Muốn check User thật thì dùng computed.isGuest
  isAuthenticated: boolean

  // Actions
  setUser: (user: User | null) => void
  setProfile: (profile: IUserProfile | null) => void
  fetchProfile: () => Promise<void>
  signOut: () => Promise<void>

  // Computed values
  computed: {
    displayName: string
    avatar: string
    isAdmin: boolean
    isGuest: boolean // <-- MỚI: Check xem có phải khách vãng lai không
  }
}

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

    // 1. Guard clause: Nếu không có user HOẶC là user ẩn danh thì không fetch profile
    // Vì bảng 'profiles' chỉ chứa thông tin của user đã đăng ký
    if (!user || user.is_anonymous) {
      set({ profile: null })
      return
    }

    const supabase = createClient()
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        // Mã PGRST116: Không tìm thấy data (User mới đăng ký chưa kịp tạo profile)
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

      set({
        user: null,
        profile: null,
        isAuthenticated: false,
        isLoading: false,
      })

      // Reload lại trang.
      // Lưu ý: AuthProvider sẽ chạy lại sau khi reload -> Tự động login Anonymous mới -> Tạo guest session mới.
      // Đây là hành vi đúng để reset giỏ hàng/session của khách.
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
  get computed() {
    const state = get()
    const user = state.user
    const metadata = user?.user_metadata

    return {
      get isGuest() {
        // Check kỹ thuộc tính is_anonymous của Supabase User
        return user?.is_anonymous ?? false
      },
      get displayName() {
        if (user?.is_anonymous) return 'Guest' // Hoặc 'Khách vãng lai'
        return metadata?.full_name || user?.email || 'User'
      },
      get avatar() {
        if (user?.is_anonymous) return '' // Guest không có avatar
        return metadata?.avatar_url || ''
      },
      get isAdmin() {
        if (user?.is_anonymous) return false
        return metadata?.role === 'admin'
      },
    }
  },
}))
