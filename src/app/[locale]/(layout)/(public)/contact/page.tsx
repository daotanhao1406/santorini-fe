import { Button, Form, Input, Textarea } from '@heroui/react'
import { MessageCircle, PhoneCall, Send } from 'lucide-react'

import { TwitterIcon } from '@/components/icons'
import { MyButton } from '@/components/ui/button'
import Typography from '@/components/ui/typography'

export default function ContactPage() {
  return (
    <div className='flex-1'>
      <main className='relative'>
        {/* Dot pattern background */}
        <div className='absolute inset-0 dot-pattern opacity-50' />

        <div className='relative mx-auto max-w-5xl px-6 py-16'>
          {/* Heading */}
          <div className='mb-16 text-center flex flex-col gap-4'>
            <Typography size='xxxl' className='font-semibold tracking-tight '>
              Talk to our friendly sales team
            </Typography>
            <Typography size='lg'>
              We'll help you find the perfect plan, no matter your business
              size.
            </Typography>
          </div>

          {/* Two column layout */}
          <div className='grid grid-cols-1 gap-12 lg:gap-24 lg:grid-cols-5'>
            {/* Form - takes 3 columns */}
            <div className='lg:col-span-3'>
              <Form className='flex flex-col space-y-6'>
                {/* Name fields */}
                <div className='grid grid-cols-1 gap-4 w-full sm:grid-cols-2'>
                  <Input
                    label='First name'
                    labelPlacement='outside'
                    type='text'
                    size='lg'
                    placeholder='First name'
                    isRequired
                    name='firstName'
                    variant='bordered'
                  />

                  <Input
                    label='Last name'
                    labelPlacement='outside'
                    type='text'
                    size='lg'
                    placeholder='Last name'
                    isRequired
                    name='lastName'
                    variant='bordered'
                  />
                </div>

                {/* Email */}
                <Input
                  name='email'
                  type='email'
                  placeholder='Enter your email address....'
                  size='lg'
                  label='Email'
                  isRequired
                  labelPlacement='outside'
                  variant='bordered'
                />

                {/* Phone */}
                <Input
                  name='phone'
                  type='tel'
                  placeholder='Enter your phone number...'
                  size='lg'
                  label='Phone Number'
                  labelPlacement='outside'
                  variant='bordered'
                  isRequired
                />

                {/* Message */}
                <Textarea
                  size='lg'
                  label='Message'
                  labelPlacement='outside'
                  placeholder='Leave us a message...'
                  required
                  name='message'
                  rows={4}
                  variant='bordered'
                />

                {/* Submit */}
                <Button
                  type='submit'
                  color='primary'
                  className='w-full'
                  size='lg'
                >
                  Send message
                </Button>
              </Form>
            </div>

            {/* Sidebar - takes 2 columns */}
            <div className='lg:col-span-2'>
              <div className='space-y-8'>
                {/* Chat with us */}
                <div className='flex flex-col'>
                  <Typography className='mb-1 font-semibold'>
                    Chat with us
                  </Typography>
                  <Typography size='sm' type='secondary'>
                    Speak to our friendly team via live chat.
                  </Typography>
                  <div className='mt-3'>
                    <div className='flex gap-2 items-center'>
                      <MessageCircle size={16} />
                      <MyButton
                        className='font-semibold -my-1'
                        variant='linkHover1'
                      >
                        Start a live chat
                      </MyButton>
                    </div>
                    <div className='flex gap-2 items-center'>
                      <Send size={16} />
                      <MyButton
                        className='font-semibold -my-1 decoration-2'
                        variant='linkHover1'
                      >
                        Shoot us an email
                      </MyButton>
                    </div>
                    <div className='flex gap-2 items-center'>
                      <TwitterIcon size={16} />
                      <MyButton
                        className='font-semibold -my-1'
                        variant='linkHover1'
                      >
                        Message us on X
                      </MyButton>
                    </div>
                  </div>
                </div>

                {/* Call us */}
                <div className='flex flex-col'>
                  <Typography className='mb-1 font-semibold'>
                    Call us
                  </Typography>
                  <Typography size='sm' type='secondary'>
                    Call our team Mon-Fri from 8am to 5pm.
                  </Typography>
                  <div className='mt-3'>
                    <div className='flex gap-2 items-center'>
                      <PhoneCall size={16} />
                      <MyButton
                        className='font-semibold -my-1'
                        variant='linkHover1'
                      >
                        093 248 5756
                      </MyButton>
                    </div>
                    <div className='flex gap-2 items-center'>
                      <PhoneCall size={16} />
                      <MyButton
                        className='font-semibold -my-1'
                        variant='linkHover1'
                      >
                        +61424 007 007
                      </MyButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
