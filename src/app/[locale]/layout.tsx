import { Metadata } from 'next'
import { Coiny, Montserrat, Pacifico } from 'next/font/google'
import { notFound } from 'next/navigation'
import { hasLocale, Locale, NextIntlClientProvider } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { ReactNode, Suspense } from 'react'

import '@/styles/globals.css'

import Footer from '@/components/layout/footer'

import { siteConfig } from '@/constant/config'
import { routing } from '@/i18n/routing'
import { AppProvider } from '@/providers/AppProvider'

type Props = {
  children: ReactNode
  params: Promise<{ locale: Locale }>
}

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-montserrat',
})

const pacifico = Pacifico({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-pacifico',
})

const coiny = Coiny({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-coiny',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`,
  },
  description: siteConfig.description,
  robots: { index: true, follow: true },
  // !STARTERCONF this is the default favicon, you can generate your own from https://realfavicongenerator.net/
  // ! copy to /favicon folder
  icons: {
    icon: '/favicon/favicon.ico',
    shortcut: '/favicon/favicon-16x16.png',
    apple: '/favicon/apple-touch-icon.png',
  },
  manifest: `/favicon/site.webmanifest`,
  openGraph: {
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.title,
    images: [`${siteConfig.url}/images/og.jpg`],
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: [`${siteConfig.url}/images/og.jpg`],
  },
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  // Enable static rendering
  setRequestLocale(locale)
  return (
    <html
      className={`${montserrat.variable} ${pacifico.variable} ${coiny.variable} light`}
      suppressHydrationWarning
      lang={locale}
    >
      <head />
      <body
        cz-shortcut-listen='true'
        className='bg-background antialiased font-montserrat'
      >
        <NextIntlClientProvider>
          <AppProvider>
            <Suspense fallback={<div>Loading...</div>}>
              <main className='flex-1'>{children}</main>
              <div className='mt-20'>
                <Footer />
              </div>
            </Suspense>
          </AppProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
