'use client'
import { addToast, Form, Textarea } from '@heroui/react'
import { Mail, MapPin, Phone, UserRound } from 'lucide-react'

import Typography from '@/components/ui/typography'

import { useCartStore } from '@/stores/use-cart-store'
import { useCheckoutStore } from '@/stores/use-checkout-store'

import { placeOrder } from '@/actions/order'
import PaymentMethodSelector from '@/elements/checkout/payment-step/payment-method-selector'
import { useRouter } from '@/i18n/navigation'

export default function PaymentStep() {
  const { shippingInfo } = useCheckoutStore()
  const { items, clearCart } = useCartStore() // Giả sử bạn có hàm clearCart
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = Object.fromEntries(new FormData(e.currentTarget)) as any
    const paymentMethod = formData.paymentMethod

    try {
      // Gọi Server Action
      const result = await placeOrder(shippingInfo, items, paymentMethod)

      if (result.success) {
        addToast({
          title: 'Success',
          description: 'Order placed!',
          color: 'success',
        })
        clearCart() // Xóa giỏ hàng
        router.push(`/order-success`) // Chuyển trang
      } else {
        addToast({
          title: 'Error',
          description: result.error || 'Something went wrong',
          color: 'danger',
        })
      }
    } catch (error: any) {
      addToast({
        title: 'Error',
        description: error.message || 'Something went wrong',
        color: 'danger',
      })
    }
  }
  return (
    <Form onSubmit={handleSubmit} id='payment-form'>
      <div className='w-full md:max-w-11/12 xl:w-3xl mt-4 space-y-4'>
        <Typography className='font-semibold' size='lg'>
          Shipping Information
        </Typography>
        <div className='flex flex-col gap-2 mt-2 ml-1 w-full'>
          <Typography className='flex items-center gap-1.5 font-semibold'>
            <UserRound size={16} strokeWidth={2.75} /> {shippingInfo?.firstName}{' '}
            {shippingInfo?.lastName}
          </Typography>
          <div className='flex flex-col gap-2 w-full'>
            <Typography
              size='sm'
              className='flex items-center gap-1.5'
              type='secondary'
            >
              <Phone size={14} /> {shippingInfo?.phone}
            </Typography>
            <Typography
              size='sm'
              className='flex items-center gap-1.5'
              type='secondary'
            >
              <Mail size={14} /> {shippingInfo?.email}
            </Typography>
            <Typography
              size='sm'
              className='flex items-start gap-1.5'
              type='secondary'
            >
              <MapPin className='mt-0.5' size={14} /> {shippingInfo?.address}
            </Typography>
          </div>
          <Textarea
            name='shippingNote'
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
        <PaymentMethodSelector name='paymentMethod' />
      </div>
    </Form>
  )
}
