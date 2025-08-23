'use client'

import { HeroUIProvider } from '@heroui/system'
import { ToastProvider } from '@heroui/toast'
import { useRouter } from 'next/navigation'
import React from 'react'

declare module '@react-types/shared' {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>['push']>[1]
    >
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  return (
    <HeroUIProvider navigate={router.push}>
      <ToastProvider />
      {children}
    </HeroUIProvider>
  )
}
