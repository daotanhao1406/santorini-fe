import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { createServer } from '@/lib/supabase/server'
import { compareObjects } from '@/lib/utils'

import { getCartByUserId, getCartItems } from '@/services/cart.service'

export async function GET() {
  const cookieStore = await cookies()
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en'
  const supabase = await createServer()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    // Trường hợp hiếm hoi: AuthProvider chưa kịp sign-in ẩn danh
    // Trả về giỏ hàng rỗng thay vì lỗi
    return NextResponse.json({ cart: [] })
  }

  const cart = await getCartByUserId(user.id)

  const { data: cartItems } = await getCartItems(cart.id, locale)

  const normalizedCart = cartItems?.map((item) => {
    return {
      ...item,
      toppings: item.toppings?.map((topping: any) => topping?.topping?.id),
    }
  })

  return NextResponse.json({ cart: normalizedCart || [] })
}

export async function POST(request: Request) {
  try {
    const supabase = await createServer()
    const {
      product_id,
      size,
      ice_level,
      sweetness_level,
      toppings,
      note,
      quantity,
    } = await request.json()

    // get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please refresh the page.' },
        { status: 401 },
      )
    }

    const cart = await getCartByUserId(user.id)
    const cartId = cart.id

    // step 2: if no existing cart, create new cart
    const { data: existingItems } = await supabase
      .from('cart_items')
      .select('*, cart_item_toppings(topping_id)')
      .eq('cart_id', cartId)
      .eq('product_id', product_id)

    const newProductMapped = {
      product_id,
      size,
      sweetness_level,
      ice_level,
      note,
      cart_item_toppings:
        Array.isArray(toppings) &&
        toppings.map((t: string) => ({ topping_id: t })).sort(),
    }

    const sameItem = existingItems?.find((item) => {
      return compareObjects(
        {
          ...item,
          cart_item_toppings:
            Array.isArray(item.cart_item_toppings) &&
            item.cart_item_toppings.sort(),
        },
        newProductMapped,
        [
          'product_id',
          'size',
          'sweetness_level',
          'ice_level',
          'note',
          'cart_item_toppings',
        ],
      )
    })

    // step 3: check if item already exists, if existing -> update quantity, if not -> add new item
    if (sameItem) {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: sameItem.quantity + quantity })
        .eq('id', sameItem.id)
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      return NextResponse.json({ message: 'Quantity updated' })
    }

    // step 4: add new cart item
    const { data: newItem, error: newItemError } = await supabase
      .from('cart_items')
      .insert({
        cart_id: cartId,
        product_id: product_id,
        quantity,
        size,
        ice_level,
        sweetness_level,
        note,
      })
      .select()
      .single()

    if (newItemError) {
      return NextResponse.json({ error: newItemError.message }, { status: 500 })
    }

    if (Array.isArray(toppings) && toppings.length > 0) {
      const toppingsRows = toppings.map((toppingId) => ({
        cart_item_id: newItem?.id,
        topping_id: toppingId,
      }))

      const { error: toppingError } = await supabase
        .from('cart_item_toppings')
        .insert(toppingsRows)
      if (toppingError)
        return NextResponse.json(
          { error: toppingError.message },
          { status: 500 },
        )
    }
    return NextResponse.json({
      success: true,
      cartId,
      message: 'Item added to cart',
    })
  } catch {
    return Response.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE() {
  const supabase = await createServer()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: cart } = await supabase
    .from('carts')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!cart) {
    // Không có cart thì coi như đã clear thành công
    return NextResponse.json({ message: 'Cart already empty' })
  }

  // Xóa tất cả items thuộc về cart_id này
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('cart_id', cart.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: 'Cart cleared successfully' })
}
