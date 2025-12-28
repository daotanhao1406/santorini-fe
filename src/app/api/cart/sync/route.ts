// app/api/cart/sync/route.ts
import { NextResponse } from 'next/server'

import { createServer } from '@/lib/supabase/server'
import { compareObjects } from '@/lib/utils'

import { getCartByUserId } from '@/services/cart.service'

export async function POST(request: Request) {
  try {
    const supabase = await createServer()
    const { items } = await request.json() // Danh sách items từ Zustand client

    // 1. Xác định User hiện tại (User thật vừa login)
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Lấy (hoặc tạo) Cart cho User thật
    const cart = await getCartByUserId(user.id)

    // 3. Lấy items hiện có trong DB của User thật để so sánh
    const { data: existingItems } = await supabase
      .from('cart_items')
      .select('*, cart_item_toppings(topping_id)')
      .eq('cart_id', cart.id)

    // 4. Duyệt qua từng item client gửi lên để Merge
    for (const clientItem of items) {
      // Map item từ client sang cấu trúc so sánh
      const mappedClientItem = {
        product_id: clientItem.product.id,
        size: clientItem.size,
        sweetness_level: clientItem.sweetness_level,
        ice_level: clientItem.ice_level,
        note: clientItem.note,
        cart_item_toppings: clientItem.toppings
          ?.map((t: string) => ({ topping_id: t }))
          .sort(),
      }

      // Check trùng
      const sameItem = existingItems?.find((dbItem) => {
        return compareObjects(
          {
            ...dbItem,
            cart_item_toppings: dbItem.cart_item_toppings?.sort(),
          },
          mappedClientItem,
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

      if (sameItem) {
        // A. Nếu trùng -> Cộng dồn số lượng
        await supabase
          .from('cart_items')
          .update({ quantity: sameItem.quantity + clientItem.quantity })
          .eq('id', sameItem.id)
      } else {
        // B. Nếu không trùng -> Insert mới
        const { data: newItem } = await supabase
          .from('cart_items')
          .insert({
            cart_id: cart.id,
            product_id: clientItem.product.id,
            quantity: clientItem.quantity,
            size: clientItem.size,
            ice_level: clientItem.ice_level,
            sweetness_level: clientItem.sweetness_level,
            note: clientItem.note,
          })
          .select()
          .single()

        // Insert toppings cho món mới
        if (newItem && clientItem.toppings?.length > 0) {
          const toppingsRows = clientItem.toppings.map((tId: string) => ({
            cart_item_id: newItem.id,
            topping_id: tId,
          }))
          await supabase.from('cart_item_toppings').insert(toppingsRows)
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Cart synced successfully',
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
