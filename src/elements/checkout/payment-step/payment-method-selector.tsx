'use client'

import {
  cn,
  RadioGroup,
  RadioGroupProps,
  RadioProps,
  useRadio,
  VisuallyHidden,
} from '@heroui/react'
import Image from 'next/image'
import React from 'react'

import Typography from '@/components/ui/typography'

// --- 1. Định nghĩa Component Custom Radio (Ô chọn tùy biến) ---
export const CustomRadio = (props: RadioProps) => {
  const {
    // Component, // <-- Chúng ta không dùng biến Component do hook trả về nữa
    children,
    description,
    getBaseProps,
    getWrapperProps,
    getInputProps,
    getLabelProps,
    getLabelWrapperProps,
    getControlProps,
  } = useRadio(props)

  return (
    // THAY ĐỔI Ở ĐÂY: Dùng trực tiếp thẻ <label>
    // Ép kiểu baseProps về any nếu TypeScript vẫn báo lỗi ở prop className (do xung đột type nội bộ thư viện)
    <label
      {...getBaseProps()}
      className={cn(
        'group inline-flex items-center justify-between hover:bg-content2 flex-row-reverse',
        'flex cursor-pointer border-2 border-default rounded-lg gap-4 p-4',
        'data-[selected=true]:border-primary',
        // Merge thêm className được truyền từ props nếu có
        props.className,
      )}
    >
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <span {...getWrapperProps()}>
        <span {...getControlProps()} />
      </span>
      <div {...getLabelWrapperProps()}>
        {children && <span {...getLabelProps()}>{children}</span>}
        {description && (
          <span className='text-small text-foreground opacity-70'>
            {description}
          </span>
        )}
      </div>
    </label>
  )
}

// --- 2. Định nghĩa Component Chính: PaymentMethodSelector ---
export default function PaymentMethodSelector({ name }: RadioGroupProps) {
  return (
    <div className='flex flex-col gap-4 w-full mt-4'>
      <RadioGroup
        classNames={{
          wrapper: 'gap-4 flex', // Khoảng cách giữa các ô
        }}
        defaultValue='cod'
        name={name}
      >
        {/* Option 1: COD */}
        <CustomRadio classNames={{ label: 'flex gap-4' }} value='cod'>
          <div className='relative w-10 h-10 shrink-0'>
            {/* Khi có ảnh thật, uncomment dòng dưới và xóa div trên: */}
            <Image
              src='/images/cash.png'
              alt='Cash'
              width={40}
              height={40}
              className='object-contain'
            />
          </div>

          <div className='flex flex-col'>
            <Typography className='font-bold'>
              Thanh toán khi nhận hàng
            </Typography>
            <Typography size='sm' type='secondary'>
              Trả bằng tiền mặt - Chúng tôi sẽ gọi điện đến bạn để xác nhận
            </Typography>
          </div>
        </CustomRadio>

        {/* Option 2: MoMo */}
        <CustomRadio classNames={{ label: 'flex gap-4' }} value='momo'>
          {/* Icon MoMo */}
          {/* Placeholder Logo MoMo */}
          <Image
            src='/images/momo.png'
            alt='Momo'
            width={40}
            height={40}
            className='object-contain rounded-md'
          />

          <div className='flex flex-col'>
            {/* <span className='font-bold text-foreground'>Momo</span>
            <span className='text-tiny text-default-500'>
              Thanh toán qua ví MOMO hoặc ứng dụng ngân hàng
            </span> */}
            <Typography className='font-bold'>Momo</Typography>
            <Typography size='sm' type='secondary'>
              Thanh toán qua ví MOMO hoặc ứng dụng ngân hàng
            </Typography>
          </div>
        </CustomRadio>
      </RadioGroup>
    </div>
  )
}
