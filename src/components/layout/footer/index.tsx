'use client'
import { Input } from '@heroui/react'
import { Facebook, Instagram, SendHorizontal, Twitter } from 'lucide-react'
import { useTranslations } from 'next-intl'

import Typography from '@/components/ui/typography'

export default function Footer() {
  const footerTranslation = useTranslations('layout.footer')
  const socialLinks = [
    { icon: Facebook, label: 'Facebook', href: '#' },
    { icon: Instagram, label: 'Instagram', href: '#' },
    { icon: Twitter, label: 'Twitter', href: '#' },
  ]

  return (
    <footer className='bg-[#ececec] py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-7xl mx-auto'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12'>
          {/* Brand Section */}
          <div className='lg:col-span-1'>
            <div
              className='flex items-center space-x-3 mb-6'
              data-testid='brand-logo'
            >
              {/* <div className='w-8 h-8 bg-primary rounded-full flex items-center justify-center'>
                <Coffee className='text-primary-foreground text-sm' />
              </div> */}
              {/* <h2 className='text-5xl font-extrabold ml-2'>JUICY</h2> */}
              <Typography size='xxxl' className='font-extrabold ml-2'>
                JUICY
              </Typography>
            </div>

            {/* Social Media Icons */}
            <div className='flex space-x-4'>
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  className='w-10 h-10 bg-muted rounded-full flex items-center justify-center hover-elevate transition-colors duration-200'
                  aria-label={label}
                  data-testid={`link-social-${label.toLowerCase()}`}
                >
                  <Icon className='text-sm' />
                </a>
              ))}
            </div>
          </div>

          {/* Opening Hours */}
          <div className='lg:col-span-1'>
            <div className='md:mb-4 mb-2'>
              <Typography size='lg' className='font-semibold'>
                {footerTranslation('opening_hours')}
              </Typography>
            </div>
            <div className='md:space-y-2 space-y-1 flex flex-col'>
              <Typography>Mon-Fri: 08:00 AM - 08:00 PM</Typography>
              <Typography>Sat-Sun: 09:00 AM - 05:00 PM</Typography>
            </div>
          </div>

          {/* Contact Info */}
          <div className='lg:col-span-1'>
            <div className='md:mb-4 mb-2'>
              <Typography size='lg' className='font-semibold'>
                {footerTranslation('contact_us.title')}
              </Typography>
            </div>

            <div className='md:space-y-2 space-y-1 flex flex-col'>
              <Typography>{footerTranslation('contact_us.address')}</Typography>
              <Typography>093 248 5756</Typography>
              <Typography>info@juicy.com</Typography>
            </div>
          </div>

          {/* Newsletter Subscription */}
          <div className='lg:col-span-1'>
            <div className='md:mb-4 mb-2'>
              <Typography size='lg' className='font-semibold'>
                {footerTranslation('subscribe.title')}
              </Typography>
            </div>
            <Input
              type='email'
              placeholder={footerTranslation('subscribe.placeholder')}
              size='lg'
              variant='bordered'
              endContent={
                <button
                  aria-label='toggle password visibility'
                  className='focus:outline-solid outline-transparent'
                  type='button'
                >
                  <SendHorizontal className='w-4 h-4' />
                </button>
              }
            />
          </div>
        </div>
      </div>
    </footer>
  )
}
