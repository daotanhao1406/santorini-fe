import { addToast } from '@heroui/react'
import { create } from 'zustand'

import { createClient } from '@/lib/supabase/client'

import { ITopping } from '@/types/topping'

interface OptionState {
  lastLocaleFetched: string

  toppings: ITopping[]

  fetched: {
    topping: boolean
  }

  fetchToppings: (locale: string) => Promise<void>
}

const supabase = createClient()

export const useProductOptionStore = create<OptionState>((set, get) => ({
  lastLocaleFetched: 'vi',
  toppings: [],

  fetched: {
    topping: false,
  },

  fetchToppings: async (locale) => {
    if (get().fetched.topping && get().lastLocaleFetched === locale) return
    const { data: toppings, error } = await supabase
      .from('toppings_with_translations')
      .select('*')
      .eq('locale', locale)

    if (error) {
      addToast({
        title: 'Error',
        description: error.message,
        color: 'danger',
      })
    }

    if (Array.isArray(toppings) && toppings.length > 0) {
      set({ toppings, fetched: { topping: true }, lastLocaleFetched: locale })
    }
  },
}))
