import { Metadata } from 'next'
import { Coiny, Montserrat, Pacifico } from 'next/font/google'
import { Suspense } from 'react'

import '@/styles/globals.css'

import { siteConfig } from '@/constant/config'
import { AppProvider } from '@/providers/AppProvider'

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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      className={`${montserrat.variable} ${pacifico.variable} ${coiny.variable} light`}
      suppressHydrationWarning
      lang='en'
    >
      <head />
      <body cz-shortcut-listen='true' className='bg-background antialiased'>
        <AppProvider>
          <div className='relative flex flex-col min-h-screen min-w-screen'>
            <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
          </div>
        </AppProvider>
      </body>
    </html>
  )
}
