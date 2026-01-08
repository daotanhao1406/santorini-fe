import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

import { hasEnvVars } from '../utils'

const SUPPORTED_LOCALES = ['vi', 'en']

const getLocaleFromPath = (pathname: string): string | null => {
  const parts = pathname.split('/')
  const maybeLocale = parts[1]
  return SUPPORTED_LOCALES.includes(maybeLocale) ? maybeLocale : null
}

// Các trang yêu cầu phải là thành viên chính thức mới được vào
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
  const normalizedPath = pathname.replace(basePath, '') || '/'
  const isProtected = protectedRoutes.includes(normalizedPath)

  // --- LOGIC PHÂN QUYỀN MỚI ---

  // Kiểm tra xem có phải là User ẩn danh không
  const isAnonymous = user?.is_anonymous === true

  // 1. Xử lý Protected Routes (/profile, /settings)
  // Nếu chưa login HOẶC là user ẩn danh -> Đều phải đá về Login
  if (isProtected && (!user || isAnonymous) && !isAuthPath) {
    const url = request.nextUrl.clone()
    url.pathname = `${basePath}/auth/login`
    url.searchParams.set('continueUrl', pathname)
    return NextResponse.redirect(url)
  }

  // 2. Xử lý Auth Routes (/auth/login, /auth/register)
  // Chỉ redirect về Home nếu là User THẬT.
  // Nếu là User ẨN DANH, vẫn cho phép ở lại trang Login để họ thực hiện đăng nhập/chuyển đổi tài khoản.
  if (user && !isAnonymous && isAuthPath) {
    const url = request.nextUrl.clone()
    url.pathname = basePath || '/'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
