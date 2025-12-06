'use client'

import { HeroUIProvider, ToastProvider } from '@heroui/react'
import { ReactNode } from 'react'

import { useRouter } from '@/i18n/navigation'
import AuthProvider from '@/providers/auth-provider'
import CartProvider from '@/providers/cart-provider'

declare module '@react-types/shared' {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>['push']>[1]
    >
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const router = useRouter()

  return (
    <HeroUIProvider navigate={router.push}>
      <ToastProvider placement='top-center' />
      <AuthProvider>
        <CartProvider>{children}</CartProvider>
      </AuthProvider>
    </HeroUIProvider>
  )
}
