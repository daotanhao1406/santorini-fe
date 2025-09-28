import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

export async function getProducts(locale: string) {
  return await supabase
    .from('products_with_translations')
    .select('*')
    .eq('locale', locale)
}
