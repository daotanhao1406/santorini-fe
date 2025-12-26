'use client'

import { Chip, cn } from '@heroui/react'
import { CheckCircle2, ClipboardList, Coffee, Truck } from 'lucide-react'
import React from 'react'

import { formatDate } from '@/lib/utils'

import Typography from '@/components/ui/typography'

// 1. Định nghĩa lại trạng thái theo quy trình F&B
export enum OrderStatus {
  PLACED = 'placed', // Mới đặt
  PREPARING = 'preparing', // ĐANG CHUẨN BỊ (Pha chế)
  DELIVERING = 'delivering', // Đang đi giao
  COMPLETED = 'completed', // Đã giao thành công
  CANCELLED = 'cancelled',
}

// 2. Cấu hình các bước (Lưu ý thứ tự mảng này quyết định thứ tự hiển thị)
const STEPS = [
  {
    key: OrderStatus.PLACED,
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

interface OrderTimeline {
  status: string
  timestamp: string
}

interface OrderStatusStepperProps {
  currentStatus: string
  timeline: OrderTimeline[]
  className?: string
}

export default function OrderStatusStepper({
  currentStatus,
  timeline,
  className,
}: OrderStatusStepperProps) {
  // Tìm index của trạng thái hiện tại để xác định bước nào đã qua
  const currentStepIndex = STEPS.findIndex((step) => step.key === currentStatus)
  // Nếu trạng thái là CANCELLED hoặc không tìm thấy, mặc định hiển thị bước đầu hoặc xử lý riêng
  const activeIndex = currentStepIndex === -1 ? 0 : currentStepIndex

  const getStepDate = (stepKey: string) => {
    const record = timeline.find((t) => t.status === stepKey)
    if (!record) return null
    return new Date(record.timestamp)
  }

  return (
    <div className={cn('w-full overflow-x-auto py-4', className)}>
      <nav aria-label='Progress'>
        <ol role='list' className='flex w-200 items-start'>
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
                        {formatDate(stepDate, 'dd-MM-yyyy HH:mm')}
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
