'use client'
import { Input } from '@heroui/input'
import { Facebook, Instagram, SendHorizontal, Twitter } from 'lucide-react'
import { useState } from 'react'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [isSubmitting] = useState(false)
  // const { toast } = useToast();

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      // toast({
      //   title: "Error",
      //   description: "Please enter your email address",
      //   variant: "destructive",
      // });
      return
    }

    // setIsSubmitting(true);

    // try {
    //   await apiRequest("POST", "/api/newsletter", { email });

    //   toast({
    //     title: "Success!",
    //     description: "You've been subscribed to our newsletter",
    //   });

    //   setEmail("");
    // } catch (error) {
    //   const errorMessage = error instanceof Error ? error.message : "Failed to subscribe";

    //   if (errorMessage.includes("409")) {
    //     toast({
    //       title: "Already subscribed",
    //       description: "This email is already subscribed to our newsletter",
    //       variant: "destructive",
    //     });
    //   } else {
    //     toast({
    //       title: "Error",
    //       description: "Failed to subscribe. Please try again.",
    //       variant: "destructive",
    //     });
    //   }
    // } finally {
    //   setIsSubmitting(false);
    // }
  }

  const socialLinks = [
    { icon: Facebook, label: 'Facebook', href: '#' },
    { icon: Instagram, label: 'Instagram', href: '#' },
    { icon: Twitter, label: 'Twitter', href: '#' },
  ]

  return (
    <footer
      className='bg-[#ececec] py-12 px-4 sm:px-6 lg:px-8'
      data-testid='footer-main'
    >
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
              <h2 className='text-5xl font-extrabold ml-2'>JUICY</h2>
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
            <h3
              className='text-lg font-semibold text-foreground mb-4'
              data-testid='heading-opening-hours'
            >
              Opening Hours
            </h3>
            <div className='space-y-2'>
              <div className='flex flex-col'>
                <span className='text-sm' data-testid='text-hours-weekday'>
                  Mon-Fri: 08:00 AM - 08:00 PM
                </span>
              </div>
              <div className='flex flex-col'>
                <span className='text-sm' data-testid='text-hours-weekend'>
                  Sat-Sun: 09:00 AM - 05:00 PM
                </span>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className='lg:col-span-1'>
            <h3
              className='text-lg font-semibold text-foreground mb-4'
              data-testid='heading-contact'
            >
              Contact Us
            </h3>
            <div className='space-y-2'>
              <p className='text-sm' data-testid='text-address-1'>
                123 Sip Street, United Brewland
              </p>
              <p className='text-sm' data-testid='text-address-2'>
                CO 12345, Cafeville
              </p>
              <p className='text-sm' data-testid='text-phone'>
                (555) 123-4567
              </p>
              <p className='text-sm' data-testid='text-email'>
                info@juicy.com
              </p>
            </div>
          </div>

          {/* Newsletter Subscription */}
          <div className='lg:col-span-1'>
            <h3
              className='text-lg font-semibold text-foreground mb-4'
              data-testid='heading-newsletter'
            >
              Subscribe Us
            </h3>
            <form
              onSubmit={handleNewsletterSubmit}
              className='space-y-4'
              data-testid='form-newsletter'
            >
              <div className='flex'>
                <Input
                  type='email'
                  placeholder='Enter your email'
                  value={email}
                  size='lg'
                  onChange={(e) => setEmail(e.target.value)}
                  // className='flex-1 rounded-r-none focus:z-10'
                  disabled={isSubmitting}
                  variant='bordered'
                  data-testid='input-newsletter-email'
                  endContent={
                    <button
                      aria-label='toggle password visibility'
                      className='focus:outline-solid outline-transparent'
                      type='button'
                      // onClick={toggleVisibility}
                    >
                      <SendHorizontal className='w-4 h-4' />
                    </button>
                  }
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </footer>
  )
}
