import { Textarea } from '@heroui/react'
import { Mail, MapPin, Phone } from 'lucide-react'

import Typography from '@/components/ui/typography'

import PaymentMethodSelector from '@/elements/checkout/payment-step/payment-method-selector'

export default function PaymentStep() {
  return (
    <div className='w-full mt-4 space-y-4'>
      <Typography className='font-semibold' size='lg'>
        Shipping Information
      </Typography>
      <div className='flex flex-col gap-2 mt-2 ml-1'>
        <Typography className='font-semibold'>Dao Tan Hao</Typography>
        <div className='flex flex-col gap-2'>
          <Typography
            size='sm'
            className='flex items-center gap-1.5'
            type='secondary'
          >
            <Phone size={14} /> 012345678
          </Typography>
          <Typography
            size='sm'
            className='flex items-center gap-1.5'
            type='secondary'
          >
            <Mail size={14} /> tanhao9h@gmail.com
          </Typography>
          <Typography
            size='sm'
            className='flex items-start gap-1.5'
            type='secondary'
          >
            <MapPin className='mt-0.5' size={14} /> 79, Đường Số 18, Phường Hiệp
            Bình Chánh, Thành Phố Thủ Đức, Thành phố Hồ Chí Minh, Việt Nam
          </Typography>
        </div>
        <Textarea
          className='mt-1'
          label={
            <Typography className='font-semibold'>
              Guide for shipper:
            </Typography>
          }
          labelPlacement='outside'
          placeholder='Content...'
        />
      </div>

      <Typography size='lg' className='font-semibold'>
        Payment Method
      </Typography>
      <PaymentMethodSelector />
    </div>
  )
}
