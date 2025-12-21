'use client'

import { addToast, Form, Input, Select, SelectItem } from '@heroui/react'

import Typography from '@/components/ui/typography'

// Dữ liệu mẫu cho Country - Trong thực tế có thể fetch từ API
const COUNTRIES = [
  { key: 'vn', label: 'Vietnam' },
  { key: 'us', label: 'United States' },
  { key: 'sg', label: 'Singapore' },
]

export default function CheckoutForm() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Lấy dữ liệu từ form native
    // const formData = Object.fromEntries(new FormData(e.currentTarget))

    // Giả lập call API submit đơn hàng
    try {
      // Simulate delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      addToast({
        title: 'Order Placed Successfully',
        description: 'Thank you for your purchase!',
        color: 'success',
      })
    } catch {
      addToast({
        title: 'Checkout Failed',
        description: 'Something went wrong. Please try again.',
        color: 'danger',
      })
    }
  }

  return (
    <div className='w-full max-w-5/6 mt-4'>
      <Form
        className='w-full flex flex-col gap-8'
        validationBehavior='native'
        onSubmit={handleSubmit}
      >
        {/* --- Section: Contact Information --- */}
        <div className='flex flex-col gap-4 w-full'>
          <Typography size='lg' className='font-semibold'>
            Contact Information
          </Typography>

          <Input
            isRequired
            label='Email address'
            labelPlacement='outside'
            name='email'
            placeholder='Enter your email'
            type='email'
            variant='bordered'
            autoComplete='email' // Quan trọng cho UX/SEO
            errorMessage='Please enter a valid email address'
          />
        </div>

        {/* --- Section: Shipping Information --- */}
        <div className='flex flex-col gap-6 w-full'>
          <Typography size='lg' className='font-semibold'>
            Shipping Information
          </Typography>

          {/* Row 1: First Name & Last Name */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <Input
              isRequired
              label='First name'
              labelPlacement='outside'
              name='firstName'
              placeholder='Enter your first name'
              variant='bordered'
              autoComplete='given-name'
            />
            <Input
              isRequired
              label='Last name'
              labelPlacement='outside'
              name='lastName'
              placeholder='Enter your last name'
              variant='bordered'
              autoComplete='family-name'
            />
          </div>

          {/* Row 2: Phone Number */}
          <Input
            isRequired
            label='Phone number'
            labelPlacement='outside'
            name='phone'
            placeholder='Enter your phone number'
            type='tel'
            variant='bordered'
            autoComplete='tel'
          />

          {/* Row 3: Address Line 1 */}
          <Input
            isRequired
            label='Address'
            labelPlacement='outside'
            name='address1'
            placeholder='Street address, P.O. box, etc.'
            variant='bordered'
            autoComplete='address-line1'
          />

          {/* Row 5: Country & City */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 items-start'>
            <Select
              isRequired
              label='Country'
              labelPlacement='outside'
              name='country'
              placeholder='Select country'
              variant='bordered'
              defaultSelectedKeys={['vn']} // Mặc định là Việt Nam
              autoComplete='country'
            >
              {COUNTRIES.map((country) => (
                <SelectItem key={country.key}>{country.label}</SelectItem>
              ))}
            </Select>

            <Input
              isRequired
              label='City'
              labelPlacement='outside'
              name='city'
              placeholder='Enter city'
              variant='bordered'
              autoComplete='address-level2'
            />
          </div>

          {/* Row 6: State & Postal Code */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <Input
              isRequired
              label='State / Province'
              labelPlacement='outside'
              name='state'
              placeholder='Enter state'
              variant='bordered'
              autoComplete='address-level1'
            />
            <Input
              isRequired
              label='Postal code'
              labelPlacement='outside'
              name='postalCode'
              placeholder='Enter postal code'
              variant='bordered'
              autoComplete='postal-code'
            />
          </div>
        </div>

        {/* Submit Button */}
        {/* <div className='mt-4'>
          <Button
            className='w-full font-medium text-white'
            color='primary'
            isLoading={isLoading}
            size='lg'
            type='submit'
          >
            Continue to Payment
          </Button>
        </div> */}
      </Form>
    </div>
  )
}
