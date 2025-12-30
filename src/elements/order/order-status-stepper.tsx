'use client'

import { addToast, Chip, cn, Skeleton } from '@heroui/react'
import {
  CheckCircle2,
  ClipboardList,
  Coffee,
  Truck,
  XCircle,
} from 'lucide-react'
import React, { useEffect, useState } from 'react'

import { createClient } from '@/lib/supabase/client'
import { formatTime } from '@/lib/utils'
import { useRealtimeOrder } from '@/hooks/use-realtime-order'

import Typography from '@/components/ui/typography'

import { OrderTimelineItem } from '@/types/order'

// 1. Định nghĩa lại trạng thái theo quy trình F&B
export enum OrderStatus {
  CONFIRMED = 'confirmed', // Mới đặt
  PREPARING = 'preparing', // ĐANG CHUẨN BỊ (Pha chế)
  DELIVERING = 'delivering', // Đang đi giao
  COMPLETED = 'completed', // Đã giao thành công
  CANCELLED = 'cancelled',
}

// 2. Cấu hình các bước (Lưu ý thứ tự mảng này quyết định thứ tự hiển thị)
const STEPS = [
  {
    key: OrderStatus.CONFIRMED,
    label: 'Đặt đơn',
    icon: ClipboardList,
  },
  {
    key: OrderStatus.PREPARING,
    label: 'Đang chuẩn bị', // <-- Bước bạn muốn thêm
    icon: Coffee, // Icon ly nước rất hợp với trà sữa
  },
  {
    key: OrderStatus.DELIVERING,
    label: 'Đang giao',
    icon: Truck, // Icon xe máy hợp với delivery food hơn xe tải
  },
  {
    key: OrderStatus.COMPLETED,
    label: 'Đã giao',
    icon: CheckCircle2,
  },
]

interface OrderStatusStepperProps {
  className?: string
  id: string
}

interface OrderStatusData {
  status: string
  timeline: OrderTimelineItem[]
}

export default function OrderStatusStepper({ id }: OrderStatusStepperProps) {
  useRealtimeOrder(id)
  const [orderData, setOrderData] = useState<OrderStatusData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    let channel: any

    const setupSubscription = async () => {
      try {
        // 1. Fetch dữ liệu ban đầu
        const { data, error } = await supabase
          .from('orders')
          .select('status, timeline')
          .eq('id', id)
          .single()

        if (error) {
          addToast({
            title: 'Fetch order timeline error',
            description: error.message,
            color: 'danger',
          })
        } else if (data) {
          // Cast kiểu dữ liệu an toàn
          setOrderData({
            status: data.status,
            timeline: Array.isArray(data.timeline) ? data.timeline : [],
          })
        }

        // 2. Thiết lập Realtime Listener ngay tại đây
        channel = supabase
          .channel(`order_tracking_${id}`)
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'orders',
              filter: `id=eq.${id}`,
            },
            (payload) => {
              const newRecord = payload.new as any

              // Cập nhật state trực tiếp -> UI tự re-render
              setOrderData({
                status: newRecord.status,
                timeline: Array.isArray(newRecord.timeline)
                  ? newRecord.timeline
                  : [],
              })
            },
          )
          .subscribe()
      } catch (err) {
        addToast({
          title: 'Setup order timeline failed',
          description: (err as Error).message,
          color: 'danger',
        })
      } finally {
        setIsLoading(false)
      }
    }

    setupSubscription()

    // Cleanup khi unmount
    return () => {
      if (channel) supabase.removeChannel(channel)
    }
  }, [id, supabase])

  if (isLoading) {
    return (
      <div className='w-full py-4'>
        <div className='flex justify-between items-center px-10'>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className='flex flex-col items-center gap-2'>
              <Skeleton className='rounded-full w-12 h-12' />
              <Skeleton className='h-3 w-20 rounded-lg' />
            </div>
          ))}
        </div>
      </div>
    )
  }

  // 2. Nếu không tìm thấy đơn hoặc dữ liệu lỗi
  if (!orderData) return null

  // 3. Xử lý trường hợp đã Hủy
  if (orderData.status === OrderStatus.CANCELLED) {
    return (
      <div className='w-full py-8 flex flex-col items-center justify-center text-danger'>
        <XCircle size={48} className='mb-2' />
        <Typography className='font-bold text-lg'>
          Đơn hàng đã bị hủy
        </Typography>
        <Typography size='sm' className='text-default-500'>
          Vui lòng liên hệ nhân viên nếu có sự nhầm lẫn.
        </Typography>
      </div>
    )
  }

  // 4. Logic hiển thị Stepper
  const currentStatus = orderData.status
  const timeline = orderData.timeline

  // Tìm index hiện tại. Nếu status lạ (chưa có trong STEPS) thì default về 0
  const currentStepIndex = STEPS.findIndex((step) => step.key === currentStatus)
  const activeIndex = currentStepIndex === -1 ? 0 : currentStepIndex

  // Helper lấy giờ từ timeline data
  const getStepDate = (stepKey: string) => {
    // Tìm entry timeline khớp với step này (hoặc entry mới nhất của status đó)
    const record = timeline.find((t) => t.status === stepKey)
    if (!record) return null
    return new Date(record.timestamp)
  }

  return (
    <div className='w-full overflow-x-auto py-4'>
      <nav aria-label='Progress'>
        <ol role='list' className='flex xl:w-200 items-start'>
          {STEPS.map((step, index) => {
            const isCompleted = index <= activeIndex
            const isLastStep = index === STEPS.length - 1
            const stepDate = getStepDate(step.key)
            const Icon = step.icon

            return (
              <div
                key={step.key}
                className='relative flex flex-col items-center flex-1'
              >
                {/* Line connector (Thanh ngang kết nối) */}
                {!isLastStep && (
                  <div
                    className={cn(
                      'absolute left-[64%] top-6 h-[2px] w-36 transform',
                      isCompleted && index < activeIndex
                        ? 'bg-primary-700' // Đã hoàn thành đoạn đường này
                        : 'bg-default-200', // Chưa tới
                    )}
                    aria-hidden='true'
                  />
                )}

                <Chip
                  className='py-6.5 px-4'
                  classNames={{ content: 'px-0 py-3' }}
                  color={isCompleted ? 'primary' : 'default'}
                >
                  <Icon size={22} strokeWidth={isCompleted ? 2 : 1.5} />
                </Chip>

                {/* Text Info */}
                <div className='mt-3 flex flex-col items-center text-center'>
                  <Typography className='font-medium' size='sm'>
                    {step.label}
                  </Typography>

                  {/* Timestamp - Chỉ hiển thị nếu có dữ liệu */}
                  <div className='h-4'>
                    {stepDate ? (
                      <Typography size='xs'>
                        {formatTime(stepDate, 'dd-MM-yyyy HH:mm')}
                      </Typography>
                    ) : (
                      // Placeholder để giữ chiều cao dòng nếu cần, hoặc để trống
                      <span className='invisible text-xs'>-</span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </ol>
      </nav>
    </div>
  )
}
