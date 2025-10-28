import { cookies } from 'next/headers'
import { v4 as uuidv4 } from 'uuid'

import { createServer } from '@/lib/supabase/server'

export async function getOrCreateCartSession() {
  const cookieStore = await cookies()
  let sessionId = cookieStore.get('cart_session')?.value

  if (!sessionId) {
    sessionId = uuidv4()
    cookieStore.set('cart_session', sessionId, { maxAge: 60 * 60 * 24 * 7 })
  }

  return sessionId
}

export async function getUserCart(userId: string) {
  const supabase = await createServer()
  return await supabase.from('carts').select('*').eq('user_id', userId).single()
}

export async function getGuestCart(sessionId: string) {
  const supabase = await createServer()
  return await supabase
    .from('carts')
    .select('*')
    .eq('session_id', sessionId)
    .single()
}

export async function getCartItems(cartId: string, locale: string) {
  const supabase = await createServer()
  return await supabase
    .from('cart_items')
    .select(
      `*, product:products_with_translations(*), toppings:cart_item_toppings(
          id,
          topping:toppings_with_translations(*)
          )`,
    )
    .eq('cart_id', cartId)
    .eq('product.locale', locale)
    .eq('cart_item_toppings.topping.locale', locale)
}

export async function mergeGuestCartIntoUserCart(
  guestCartId: string,
  userCartId: string,
) {
  const supabase = await createServer()
  const { data: guestItems } = await getGuestCart(guestCartId)

  if (!guestItems?.length) return

  for (const item of guestItems) {
    // Kiểm tra xem userCart đã có item tương tự chưa
    const { data: existing } = await supabase
      .from('cart_items')
      .select('id, quantity, options')
      .eq('cart_id', userCartId)
      .eq('product_id', item.product_id)
      .eq('options', item.options) // so sánh JSON options (size, sugar,...)
      .single()

    if (existing) {
      await supabase
        .from('cart_items')
        .update({ quantity: existing.quantity + item.quantity })
        .eq('id', existing.id)
    } else {
      await supabase.from('cart_items').insert({
        cart_id: userCartId,
        product_id: item.product_id,
        quantity: item.quantity,
        options: item.options,
      })
    }
  }
}
