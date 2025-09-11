import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

import { hasEnvVars } from '../utils'

const SUPPORTED_LOCALES = ['vi', 'en']

const getLocaleFromPath = (pathname: string): string | null => {
  const parts = pathname.split('/')
  const maybeLocale = parts[1]
  return SUPPORTED_LOCALES.includes(maybeLocale) ? maybeLocale : null
}

export async function updateSession(
  request: NextRequest,
  response: NextResponse,
) {
  let supabaseResponse = response

  // If the env vars are not set, skip middleware check. You can remove this
  // once you setup the project.
  if (!hasEnvVars) {
    return supabaseResponse
  }

  // With Fluid compute, don't put this client in a global environment
  // variable. Always create a new one on each request.
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
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  // Do not run code between createServerClient and
  // supabase.auth.getClaims(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: If you remove getClaims() and you use server-side rendering
  // with the Supabase client, your users may be randomly logged out.
  const { data } = await supabase.auth.getClaims()
  const user = data?.claims

  const pathname = request.nextUrl.pathname
  const locale = getLocaleFromPath(pathname)
  const basePath = locale ? `/${locale}` : ''

  const isAuthPath = pathname.startsWith(`${basePath}/auth`)
  const isRoot = pathname === '/' || pathname === `/${locale}`

  if (!user && !isAuthPath && !isRoot) {
    // Chưa đăng nhập → chuyển về /[locale]/auth/login
    const url = request.nextUrl.clone()
    url.pathname = `${basePath}/auth/login`
    return NextResponse.redirect(url)
  }

  if (user && isAuthPath) {
    // Đã đăng nhập mà vào /auth → chuyển về /[locale]/home
    const url = request.nextUrl.clone()
    url.pathname = `${basePath}/home`
    return NextResponse.redirect(url)
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse
}
