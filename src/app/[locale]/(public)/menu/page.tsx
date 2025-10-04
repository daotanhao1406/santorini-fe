import { getLocale } from 'next-intl/server'

import { createServer } from '@/lib/supabase/server'

import CategoryList from '@/elements/menu/category/category-list'
import ProductList from '@/elements/menu/product/product-list'

import { Product } from '@/types/product'

export default async function MenuPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const locale = await getLocale()
  const supabase = await createServer()
  const params = await searchParams

  const { data: categories } = await supabase
    .from('categories_with_translations')
    .select('*')
    .eq('locale', locale)

  const activeSlug = params.category || 'fruit-tea'

  const { data } = await supabase
    .from('products_with_translations')
    .select('*, categories!inner(*)')
    .eq('categories.slug', activeSlug)
    .eq('locale', locale)

  const products = data as Product[]
  return (
    <div className='m-10'>
      <span className='text-xl font-bold'>Categories</span>
      <div className='pt-8'>
        <CategoryList items={categories} activeSlug={activeSlug} />
      </div>
      <p className='text-xl font-bold mt-8'>Products</p>
      <div className='pt-8'>
        <ProductList items={products} />
      </div>
    </div>
  )
}
