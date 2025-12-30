'use client'

import { addToast } from '@heroui/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { createClient } from '@/lib/supabase/client'

// Định nghĩa trạng thái đơn hàng (F&B logic)
type OrderStatus =
  | 'confirmed'
  | 'preparing'
  | 'shipping'
  | 'completed'
  | 'cancelled'

interface OrderPayload {
  id: string
  status: OrderStatus
  user_id: string
  // ... các field khác
}

export const useRealtimeOrder = (orderId: string) => {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    if (!orderId) return

    // Tạo channel lắng nghe
    const channel = supabase
      .channel(`order_updates_${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE', // Chỉ nghe sự kiện Update
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`, // Lọc đúng đơn hàng này để tối ưu performance
        },
        (payload) => {
          const newOrder = payload.new as OrderPayload

          // Xử lý logic F&B khi trạng thái thay đổi
          handleStatusChange(newOrder.status)

          // Refresh lại data trên page (Server Component)
          router.refresh()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [orderId, router, supabase])

  // Helper function để hiển thị thông báo thân thiện với người dùng
  const handleStatusChange = (status: OrderStatus) => {
    const title = 'Cập nhật đơn hàng'
    let description = ''
    let color: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' =
      'primary'

    switch (status) {
      case 'confirmed':
        description = 'Quán đã nhận đơn! Đang chuẩn bị trà sữa cho bạn nha.'
        color = 'primary'
        break
      case 'preparing':
        description = 'Barista đang pha chế những ly nước thơm ngon.'
        color = 'warning' // Màu vàng tạo cảm giác active
        break
      case 'shipping':
        description = 'Shipper đang trên đường giao tới bạn!'
        color = 'secondary'
        break
      case 'completed':
        description = 'Đơn hàng đã hoàn tất. Chúc bạn ngon miệng!'
        color = 'success'
        break
      case 'cancelled':
        description = 'Đơn hàng đã bị hủy.'
        color = 'danger'
        break
    }

    if (description) {
      addToast({
        title,
        description,
        color,
        timeout: 5000,
      })
    }
  }
}
