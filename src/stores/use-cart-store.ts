import { addToast } from '@heroui/react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { IProduct, ProductOptionsType } from '@/types/product'

export type CartItemType = {
  id: string
  product: IProduct
  quantity: number
} & ProductOptionsType

interface CartState {
  items: CartItemType[]
}

interface CartActions {
  addItem: (item: CartItemType) => Promise<void>
  updateItem: (item: CartItemType) => Promise<void>
  removeItem: (cartId: string) => Promise<void>
  increaseQuantity: (cartId: string) => void
  decreaseQuantity: (cartId: string) => void
  clearCart: () => Promise<void>

  //server-side actions
  loadCartFromServer: () => Promise<void>
  syncCartToServer: () => Promise<void>
}

export const useCartStore = create<CartState & CartActions>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: async (item: CartItemType) => {
        const formData = {
          ...item,
          product_id: item.product.id,
        }
        const res = await fetch('/api/cart/items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })

        const data = await res.json()
        if (!res.ok) {
          addToast({
            title: data.error,
            description: data.message,
            color: 'danger',
          })
        }

        // addToast({
        //   title: 'Successfully',
        //   description: data.message,
        //   color: 'success',
        // })
      },
      updateItem: async (item: CartItemType) => {
        const items = get().items
        const existingItem = items.find((i) => i.id === item.id)

        if (existingItem) {
          const res = await fetch(`/api/cart/items/${existingItem.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item),
          })

          const data = await res.json()
          if (!res.ok) {
            addToast({
              title: data.error,
              description: data.message,
              color: 'danger',
            })
          }

          // addToast({
          //   title: 'Successfully',
          //   description: data.message,
          //   color: 'success',
          // })
        }
      },
      increaseQuantity: async (cartItemId: string) => {
        const oldState = get().items
        const item = oldState.find((i) => i.id === cartItemId)
        set((state) => ({
          items: state.items.map((i) =>
            i.id === cartItemId ? { ...i, quantity: i.quantity + 1 } : i,
          ),
        }))
        if (item) {
          const res = await fetch(`/api/cart/items/${cartItemId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity: item.quantity + 1 }),
          })

          const data = await res.json()
          if (!res.ok) {
            set({ items: oldState })
            addToast({
              title: data.error,
              description: data.message,
              color: 'danger',
            })
          }
        }
      },
      decreaseQuantity: async (cartItemId: string) => {
        const oldState = get().items
        const item = oldState.find((i) => i.id === cartItemId)
        set((state) => ({
          items: state.items.map((i) =>
            i.id === cartItemId ? { ...i, quantity: i.quantity - 1 } : i,
          ),
        }))
        if (item) {
          const res = await fetch(`/api/cart/items/${cartItemId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity: item.quantity - 1 }),
          })

          const data = await res.json()
          if (!res.ok) {
            set({ items: oldState })
            addToast({
              title: data.error,
              description: data.message,
              color: 'danger',
            })
          }
        }
      },
      removeItem: async (cartItemId: string) => {
        const res = await fetch(`/api/cart/items/${cartItemId}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        })

        const data = await res.json()
        if (!res.ok) {
          addToast({
            title: data.error,
            description: data.message,
            color: 'danger',
          })
        }

        addToast({
          title: 'Successfully',
          description: data.message,
          color: 'success',
        })
      },
      clearCart: async () => {
        // 1. Xóa ngay lập tức ở Client để UI phản hồi nhanh
        set({ items: [] })

        try {
          // 2. Gọi API để xóa trong Database dựa trên cookie
          await fetch('/api/cart/items', {
            method: 'DELETE',
          })
        } catch {
          addToast({
            title: 'Error',
            description: 'Failed to clear cart',
            color: 'danger',
          })
        }
      },

      // get cart from server
      loadCartFromServer: async () => {
        try {
          const res = await fetch('/api/cart/items', { method: 'GET' })
          if (!res.ok) throw new Error('Failed to load cart')
          const { cart } = await res.json()
          set({ items: cart || [] })
        } catch {
          addToast({
            title: 'Error',
            description: 'Failed to load cart',
            color: 'danger',
          })
        }
      },

      // 🔹 Gửi cart local lên Supabase để merge (sau khi login)
      syncCartToServer: async () => {
        const { items } = get()
        if (!items.length) return

        try {
          await fetch('/api/cart/items/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items }),
          })
        } catch {
          addToast({
            title: 'Error',
            description: 'Error syncing cart',
            color: 'danger',
          })
        }
      },
    }),
    {
      name: 'cart-store',
      partialize: (state) => ({ items: state.items }),
    },
  ),
)

export const calcTotalCartItemsPrice = (cartItems: CartItemType[]) => {
  if (!Array.isArray(cartItems)) return 0
  return cartItems.reduce(
    (total, cartItem) =>
      total + cartItem.product.base_price * cartItem.quantity,
    0,
  )
}

export const calcTotalCartItemsQuantity = (cartItems: CartItemType[]) => {
  if (!Array.isArray(cartItems)) return 0
  return cartItems.reduce((total, cartItem) => total + cartItem.quantity, 0)
}
