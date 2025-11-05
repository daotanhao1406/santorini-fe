import { NextResponse } from 'next/server'

import { createServer } from '@/lib/supabase/server'

import {
  getGuestCart,
  getOrCreateCartSession,
  getUserCart,
  mergeGuestCartIntoUserCart,
} from '@/services/cart.service'

export async function POST() {
  const supabase = await createServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user)
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  // 1️⃣ Lấy session_id từ cookie
  const sessionId = await getOrCreateCartSession()

  // 2️⃣ Lấy cart của guest
  const { data: guestCart, error: guestCartError } =
    await getGuestCart(sessionId)

  // Nếu không có guest cart thì thôi
  if (guestCartError)
    return NextResponse.json(
      { message: guestCartError.message },
      { status: 500 },
    )

  // 3️⃣ Lấy cart của user
  const { data: userCart } = await getUserCart(user.id)

  if (!userCart) {
    // Nếu user chưa có cart, cập nhật cart guest thành cart user
    await supabase
      .from('carts')
      .update({ user_id: user.id, session_id: null })
      .eq('id', guestCart.id)

    const res = NextResponse.json({ message: 'Cart assigned to user' })
    res.cookies.delete('cart_session')
    return res
  }

  // 4️⃣ Merge items từ guestCart sang userCart
  if (guestCart && userCart) {
    await mergeGuestCartIntoUserCart(guestCart.id, userCart.id)

    // 🗑️ Xóa guest cart sau khi merge
    await supabase.from('carts').delete().eq('id', guestCart.id)

    // ✅ Clear session cookie
    const res = NextResponse.json({
      merged: true,
      message: 'Guest cart merged into user cart successfully',
    })
    res.cookies.delete('cart_session')
    return res
  }
}
