import { NextResponse } from 'next/server'

import { createServer } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  // URL để redirect user về sau khi verify thành công
  // Thường là trang chủ hoặc trang checkout nếu họ đang mua dở
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createServer()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // OPTIONAL: Tại đây bạn có thể gọi logic Merge Cart Server-side nếu muốn
      // Tuy nhiên, để đơn giản, khi redirect về trang chủ, client sẽ tự load lại cart

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Nếu lỗi, trả về trang lỗi auth
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
