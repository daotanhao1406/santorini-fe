import { create } from 'zustand'

export interface ShippingInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  country: string
  city: string
  state: string
  postalCode: string
  shippingNote?: string
}

interface CheckoutState {
  currentStep: number
  shippingInfo: ShippingInfo | null
  setStep: (step: number) => void
  setShippingInfo: (info: ShippingInfo) => void
  nextStep: () => void
  prevStep: () => void

  loading: boolean
  setLoading: (loading: boolean) => void
}

export const useCheckoutStore = create<CheckoutState>((set) => ({
  currentStep: 1,
  shippingInfo: null,
  setStep: (step) => set({ currentStep: step }),
  setShippingInfo: (info) => set({ shippingInfo: info }),
  nextStep: () =>
    set((state) => ({ currentStep: Math.min(state.currentStep + 1, 3) })),
  prevStep: () =>
    set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),

  loading: false,
  setLoading: (loading) => set({ loading }),
}))
