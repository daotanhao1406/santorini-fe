import { NextResponse } from 'next/server'

import { createServer } from '@/lib/supabase/server'

import { getOrCreateCartSession } from '@/services/carts'

export async function POST(request: Request) {
  try {
    const supabase = await createServer()
    const { productId, quantity } = await request.json()

    const sessionId = await getOrCreateCartSession()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { data: carts } = await supabase
      .from('carts')
      .select('*')
      .eq(user ? 'user_id' : 'session_id', user ? user?.id : sessionId)
      .limit(1)
      .maybeSingle()

    // console.log('cart', carts)

    let cartId = carts?.id

    if (!cartId) {
      const { data: newCart } = await supabase
        .from('carts')
        .insert({
          user_id: user?.id || null,
          session_id: user ? null : sessionId,
        })
        .select()
        .single()

      // console.log('new cart', newCart)

      cartId = newCart?.id
    }

    await supabase.from('cart_items').insert({
      cart_id: cartId,
      product_id: productId,
      quantity,
    })
    return NextResponse.json({ success: true, cartId })
  } catch {
    return Response.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
