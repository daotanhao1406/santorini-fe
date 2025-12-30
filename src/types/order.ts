// types/order.ts (hoặc nơi bạn define type)

import { ProductOptionsType } from '@/types/product'

export type OrderStatus =
  | 'confirmed'
  | 'preparing'
  | 'delivering'
  | 'completed'
  | 'cancelled'

export interface OrderTimelineItem {
  status: OrderStatus
  timestamp: string // ISO String từ DB
}

export interface IOrder {
  id: string
  created_at: string

  status: OrderStatus
  total_price: number
  sub_total_price: number
  discount: number
  shipping_fee: number
  payment_method: 'cod' | 'momo'

  user_id: string
  full_name: string
  email: string
  address: string
  phone: string
  note?: string

  timeline: OrderTimelineItem[]
}

export interface IOrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  size: ProductOptionsType['size']
  sweetness_level: ProductOptionsType['sweetness_level']
  ice_level: ProductOptionsType['ice_level']
  note?: ProductOptionsType['note']
}
