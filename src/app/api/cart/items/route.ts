import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { createServer } from '@/lib/supabase/server'
import { compareObjects } from '@/lib/utils'

import {
  getCartItems,
  getGuestCart,
  getOrCreateCartSession,
  getUserCart,
  mergeGuestCartIntoUserCart,
} from '@/services/cart.service'

export async function GET() {
  const cookieStore = await cookies()
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en'
  const supabase = await createServer()
  const sessionId = await getOrCreateCartSession()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    // get user cart
    const { data: userCart } = await getUserCart(user.id)

    // get guest cart (if has)
    const { data: guestCart } = await getGuestCart(sessionId)

    // if has guest cart → merge to user cart
    if (guestCart && userCart) {
      await mergeGuestCartIntoUserCart(guestCart.id, userCart.id)
      // delete guest cart after merge
      await supabase.from('carts').delete().eq('id', guestCart.id)
    }

    // Lấy lại cart của user sau khi merge
    const { data: cart } = await getCartItems(userCart?.id, locale)

    const normalizedCart = cart?.map((item) => {
      return {
        ...item,
        toppings: item.toppings?.map((topping: any) => {
          return topping?.topping?.id
        }),
      }
    })

    return NextResponse.json({ cart: normalizedCart })
  }

  const { data: guestCart } = await getGuestCart(sessionId)

  const { data: cart } = guestCart
    ? await getCartItems(guestCart.id, locale)
    : { data: [] }

  const normalizedCart = cart?.map((item) => {
    return {
      ...item,
      toppings: item.toppings?.map((topping: any) => {
        return topping?.topping?.id
      }),
    }
  })

  return NextResponse.json({ cart: normalizedCart })
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

    const sessionId = await getOrCreateCartSession()

    // get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // step 1: get existing cart of user or create new if unauthenticated
    const { data: existingCart } = user
      ? await getUserCart(user.id)
      : await getGuestCart(sessionId)

    let cartId = existingCart?.id

    if (!cartId) {
      const { data: newCart, error: newCartError } = await supabase
        .from('carts')
        .insert({
          user_id: user?.id || null,
          session_id: user ? null : sessionId,
        })
        .select()
        .single()

      if (newCartError)
        return NextResponse.json(
          { error: newCartError.message },
          { status: 400 },
        )
      cartId = newCart?.id
    }

    // step 2: if no existing cart, create new cart
    const { data: existingItems } = await supabase
      .from('cart_items')
      .select('*, cart_item_toppings(topping_id)')
      .eq('cart_id', cartId)
      .eq('product_id', product_id)

    const mappedProduct = {
      product_id: product_id,
      size,
      sweetness_level,
      ice_level,
      note,
      cart_item_toppings:
        Array.isArray(toppings) &&
        toppings
          .map((topping: string) => ({
            topping_id: topping,
          }))
          .sort(),
    }

    const sameItem = existingItems?.find((item) => {
      return compareObjects(
        {
          ...item,
          cart_item_toppings:
            Array.isArray(item.cart_item_toppings) &&
            item.cart_item_toppings.sort(),
        },
        mappedProduct,
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
