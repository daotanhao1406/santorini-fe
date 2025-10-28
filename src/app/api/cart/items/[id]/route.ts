import { NextResponse } from 'next/server'

import { createServer } from '@/lib/supabase/server'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createServer()
  const { id } = await params
  const { size, ice_level, sweetness_level, toppings, note, quantity } =
    await request.json()

  // update options
  const { error: updateOptionsError } = await supabase
    .from('cart_items')
    .update({
      size,
      ice_level,
      sweetness_level,
      note,
      quantity,
    })
    .eq('id', id)
  if (updateOptionsError) {
    return NextResponse.json(
      { error: updateOptionsError.message },
      { status: 500 },
    )
  }

  if (Array.isArray(toppings) && toppings.length > 0) {
    // update toppings
    const { data: oldToppingsData, error: oldToppingsError } = await supabase
      .from('cart_item_toppings')
      .select('topping_id')
      .eq('cart_item_id', id)

    if (oldToppingsError) {
      return NextResponse.json(
        { error: oldToppingsError.message },
        { status: 500 },
      )
    }

    const oldToppingIds = oldToppingsData.map((t) => t.topping_id)

    // 3.1. Toppings cần XÓA: Có trong MẢNG CŨ nhưng KHÔNG có trong MẢNG MỚI
    const toppingsToDelete = oldToppingIds.filter(
      (id) => !toppings.includes(id),
    )

    // 3.2. Toppings cần THÊM: Có trong MẢNG MỚI nhưng KHÔNG có trong MẢNG CŨ
    const toppingsToAdd = toppings.filter((id) => !oldToppingIds.includes(id))

    const promises = []

    // 4.1. Tạo promise để XÓA (nếu có)
    if (toppingsToDelete.length > 0) {
      promises.push(
        supabase
          .from('cart_item_toppings')
          .delete()
          .eq('cart_item_id', id)
          .in('topping_id', toppingsToDelete), // Xóa các topping_id trong mảng này
      )
    }

    // 4.2. Tạo promise để THÊM (nếu có)
    if (toppingsToAdd.length > 0) {
      const newRows = toppingsToAdd.map((toppingId: string) => ({
        cart_item_id: id,
        topping_id: toppingId,
      }))

      promises.push(supabase.from('cart_item_toppings').insert(newRows))
    }

    // 4.3. Chạy song song các promise
    if (promises.length > 0) {
      const results = await Promise.all(promises)

      // Kiểm tra lỗi trong bất kỳ promise nào
      const anyError = results.find((res) => res.error)
      if (anyError) {
        return NextResponse.json(
          { error: 'Update toppings failed' },
          { status: 500 },
        )
      }
    }
  }

  return NextResponse.json({
    success: true,
    message: 'Item added to cart',
  })
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createServer()
  const { id } = await params
  const { quantity } = await request.json()

  const { error } = await supabase
    .from('cart_items')
    .update({ quantity })
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({
    success: true,
    message: 'Item quantity updated',
  })
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createServer()
  const { id } = await params

  const { error } = await supabase.from('cart_items').delete().eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({
    success: true,
    message: 'Item removed from cart',
  })
}
