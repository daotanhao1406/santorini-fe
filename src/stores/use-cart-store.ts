import { isEqual } from 'lodash'
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
  addItem: (item: CartItemType) => void
  updateItem: (item: CartItemType) => void
  removeItem: (cartId: string) => void
  increaseQuantity: (cartId: string) => void
  decreaseQuantity: (cartId: string) => void
  clearCart: () => void
}

export const useCartStore = create<CartState & CartActions>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item: CartItemType) => {
        const items = get().items
        const existingItem = items.find((i) => {
          const itemWithProductId = {
            ...item,
            id: null, // delete id and quantity in item to compare
            quantity: null,
            product: item.product.id,
            toppings: item.toppings.sort(),
          }
          const iWithProductId = {
            ...i,
            id: null,
            quantity: null,
            product: i.product.id,
            toppings: i.toppings.sort(),
          }
          return (
            i.product.id === item.product.id &&
            isEqual(iWithProductId, itemWithProductId)
          )
        })

        if (existingItem) {
          set({
            items: items.map((i) =>
              i.id === existingItem.id
                ? { ...i, quantity: i.quantity + item.quantity }
                : i,
            ),
          })
        } else {
          set({ items: [...items, { ...item, quantity: item.quantity }] })
        }
      },
      updateItem: (item: CartItemType) => {
        const items = get().items
        const existingItem = items.find((i) => i.id === item.id)

        if (existingItem) {
          set({
            items: items.map((i) =>
              i.id === existingItem.id ? { ...existingItem, ...item } : i,
            ),
          })
        }
      },
      removeItem: (cartId: string) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== cartId),
        })),
      increaseQuantity: (cartId: string) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === cartId ? { ...i, quantity: i.quantity + 1 } : i,
          ),
        })),
      decreaseQuantity: (cartId: string) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === cartId ? { ...i, quantity: i.quantity - 1 } : i,
          ),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-store',
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
