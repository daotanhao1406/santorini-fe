import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

import { hasEnvVars } from '../utils'

const SUPPORTED_LOCALES = ['vi', 'en']

const getLocaleFromPath = (pathname: string): string | null => {
  const parts = pathname.split('/')
  const maybeLocale = parts[1]
  return SUPPORTED_LOCALES.includes(maybeLocale) ? maybeLocale : null
}

const protectedRoutes = ['/profile', '/settings']

export async function updateSession(
  request: NextRequest,
  response: NextResponse,
) {
  let supabaseResponse = response

  if (!hasEnvVars) {
    return supabaseResponse
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  const { data } = await supabase.auth.getClaims()
  const user = data?.claims

  const pathname = request.nextUrl.pathname
  const locale = getLocaleFromPath(pathname)
  const basePath = locale ? `/${locale}` : ''

  const isAuthPath = pathname.startsWith(`${basePath}/auth`)

  // Xác định route gốc
  const normalizedPath = pathname.replace(basePath, '') || '/'

  const isProtected = protectedRoutes.includes(normalizedPath)

  // Nếu route là protected mà chưa login → redirect về login
  if (isProtected && !user && !isAuthPath) {
    const url = request.nextUrl.clone()
    url.pathname = `${basePath}/auth/login`
    url.searchParams.set('continueUrl', pathname)
    return NextResponse.redirect(url)
  }

  // Nếu đã login mà vào /auth → redirect về home
  if (user && isAuthPath) {
    const url = request.nextUrl.clone()
    url.pathname = basePath || '/'
    return NextResponse.redirect(url)
  }

  // Nếu route là public → cho phép
  // Nếu route không nằm trong public/protected → bạn chọn mặc định xử lý (ở đây cho phép)
  return supabaseResponse
}
