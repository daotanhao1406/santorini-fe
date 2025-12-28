import { createServer } from '@/lib/supabase/server'

export async function getCartByUserId(userId: string) {
  const supabase = await createServer()

  // Tìm cart của user này
  const { data: cart } = await supabase
    .from('carts')
    .select('*')
    .eq('user_id', userId)
    .single()

  // Nếu chưa có thì tạo mới luôn
  if (!cart) {
    const { data: newCart, error } = await supabase
      .from('carts')
      .insert({ user_id: userId })
      .select()
      .single()

    if (error) throw new Error(error.message)
    return newCart
  }

  return cart
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
