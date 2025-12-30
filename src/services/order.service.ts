import { createClient } from '@/lib/supabase/client'

export async function getOrderById(orderId: string) {
  const supabase = createClient()

  return await supabase.from('orders').select('*').eq('id', orderId).single()
}
