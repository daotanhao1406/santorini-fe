// src/actions/place-order.ts
'use server'

import { revalidatePath } from 'next/cache'

import { createServer } from '@/lib/supabase/server'

import { CartItemType } from '@/stores/use-cart-store'

// Định nghĩa kiểu dữ liệu trả về
export type PlaceOrderResult =
  | { success: true; orderId: string }
  | { success: false; error: string }

export async function placeOrder(
  shippingInfo: any,
  items: CartItemType[],
  paymentMethod: string,
): Promise<PlaceOrderResult> {
  const supabase = await createServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  try {
    // ---------------------------------------------------------
    // BƯỚC 1: VALIDATION & TÍNH TIỀN (SERVER-SIDE)
    // ---------------------------------------------------------
    if (!items || items.length === 0) {
      throw new Error('Giỏ hàng trống')
    }

    // 1.1 Lấy danh sách ID sản phẩm để query giá gốc
    const productIds = items.map((item) => item.product.id)
    const { data: products, error: productError } = await supabase
      .from('products') // Lưu ý: Tên bảng products của bạn
      .select('id, base_price')
      .in('id', productIds)

    if (productError || !products) {
      throw new Error('Lỗi khi lấy thông tin sản phẩm')
    }

    // 1.2 Tính tổng tiền
    let calculatedTotal = 0

    items.forEach((item) => {
      const dbProduct = products.find((p) => p.id === item.product.id)
      if (!dbProduct) return // Bỏ qua nếu không tìm thấy sp

      // Giá cơ bản
      let unitPrice = dbProduct.base_price

      // Logic tính tiền Size (Ví dụ: Size L thêm 5.000đ)
      // Bạn hãy sửa lại số tiền này theo đúng logic quán của bạn
      if (item.size === 'L') unitPrice += 5000
      if (item.size === 'M') unitPrice += 0 // Size M giá gốc

      // Logic tính tiền Topping (Giả sử mỗi topping thêm 5.000đ)
      // Nếu bạn có bảng toppings riêng, hãy query giá topping tương tự như query products
      if (item.toppings && item.toppings.length > 0) {
        unitPrice += item.toppings.length * 5000
      }

      calculatedTotal += unitPrice * item.quantity
    })

    // ---------------------------------------------------------
    // BƯỚC 2: TẠO ORDER (BẢNG CHA)
    // ---------------------------------------------------------
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        full_name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
        email: shippingInfo.email,
        phone: shippingInfo.phone,
        address: shippingInfo.address,
        note: shippingInfo.shippingNote, // Ghi chú giao hàng
        payment_method: paymentMethod,
        user_id: user?.id,
        total_price: calculatedTotal,
        timeline: [
          {
            status: 'confirmed',
            timestamp: new Date().toISOString(),
          },
        ],
      })
      .select('id')
      .single()

    if (orderError || !order) {
      throw new Error('Không thể tạo đơn hàng')
    }

    // ---------------------------------------------------------
    // BƯỚC 3: TẠO ORDER ITEMS (BẢNG CON) - BULK INSERT
    // ---------------------------------------------------------

    // Map dữ liệu từ Cart Item sang Database Row
    const orderItemsData = items.map((item) => {
      // Xử lý ghi chú: Gộp note của khách + danh sách topping (vì DB thiếu cột toppings)
      let finalNote = item.note || ''
      if (item.toppings && item.toppings.length > 0) {
        // Ví dụ: "Ít ngọt - Topping: Trân châu đen, Thạch dừa"
        const toppingString = `Topping: ${item.toppings.join(', ')}`
        finalNote = finalNote
          ? `${finalNote} - ${toppingString}`
          : toppingString
      }

      return {
        order_id: order.id, // ID của Order vừa tạo
        product_id: item.product.id,
        quantity: item.quantity,
        size: item.size, // 'M', 'L'
        sweetness_level: item.sweetness_level, // '0%', '50%', '100%'
        ice_level: item.ice_level, // 'No Ice', 'Less Ice', 'Normal'
        note: finalNote, // Ghi chú đã gộp topping
      }
    })

    // Insert 1 lần cho tất cả items
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsData)

    if (itemsError) {
      // Note: Ở đây có thể thêm logic xóa Order cha nếu insert con thất bại (Manual Rollback)
      throw new Error('Lỗi khi lưu chi tiết sản phẩm')
    }

    // ---------------------------------------------------------
    // BƯỚC 4: HOÀN TẤT
    // ---------------------------------------------------------

    // Revalidate các trang cần thiết để cập nhật dữ liệu mới
    revalidatePath('/profile/orders')

    return { success: true, orderId: order.id }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Đã có lỗi xảy ra khi đặt hàng.',
    }
  }
}
