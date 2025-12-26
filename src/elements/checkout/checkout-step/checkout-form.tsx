'use client'

import { Form, Input } from '@heroui/react'

import Typography from '@/components/ui/typography'

import { useCheckoutStore } from '@/stores/use-checkout-store'

export default function CheckoutForm() {
  const { nextStep, setShippingInfo, shippingInfo } = useCheckoutStore()
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Lấy dữ liệu từ form native
    const formData = Object.fromEntries(new FormData(e.currentTarget)) as any
    setShippingInfo(formData)

    nextStep()
  }

  return (
    <div className='w-full mt-4'>
      <Form
        id='checkout-form'
        className='w-full flex flex-col gap-8'
        // validationBehavior='native'
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
            defaultValue={shippingInfo?.email}
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
              errorMessage='Please enter your first name'
              label='First name'
              labelPlacement='outside'
              name='firstName'
              placeholder='Enter your first name'
              variant='bordered'
              autoComplete='given-name'
              defaultValue={shippingInfo?.firstName}
            />
            <Input
              isRequired
              label='Last name'
              labelPlacement='outside'
              name='lastName'
              placeholder='Enter your last name'
              variant='bordered'
              autoComplete='family-name'
              defaultValue={shippingInfo?.lastName}
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
            defaultValue={shippingInfo?.phone}
          />

          {/* Row 3: Address Line 1 */}
          <Input
            isRequired
            label='Address'
            labelPlacement='outside'
            name='address'
            placeholder='Street address, P.O. box, etc.'
            variant='bordered'
            autoComplete='address-line'
            defaultValue={shippingInfo?.address}
          />

          {/* Row 5: Country & City */}
          {/* <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 items-start'>
            <Select
              isRequired
              label='Country'
              labelPlacement='outside'
              name='country'
              placeholder='Select country'
              variant='bordered'
              defaultSelectedKeys={
                shippingInfo?.country ? [shippingInfo.country] : ['vn']
              }
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
              autoComplete='address-level'
              defaultValue={shippingInfo?.city}
            />
          </div> */}

          {/* Row 6: State & Postal Code */}
          {/* <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <Input
              isRequired
              label='State / Province'
              labelPlacement='outside'
              name='state'
              placeholder='Enter state'
              variant='bordered'
              autoComplete='address-level'
              defaultValue={shippingInfo?.state}
            />
            <Input
              isRequired
              label='Postal code'
              labelPlacement='outside'
              name='postalCode'
              placeholder='Enter postal code'
              variant='bordered'
              autoComplete='postal-code'
              defaultValue={shippingInfo?.postalCode}
            />
          </div> */}
        </div>
      </Form>
    </div>
  )
}
