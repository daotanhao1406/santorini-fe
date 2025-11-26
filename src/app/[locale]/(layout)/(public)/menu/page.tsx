import { getLocale, getTranslations } from 'next-intl/server'

import { createServer } from '@/lib/supabase/server'

import Typography from '@/components/ui/typography'

import CategoryList from '@/elements/menu/category/category-list'
import ProductList from '@/elements/menu/product/product-list'

import { IProduct } from '@/types/product'

export default async function MenuPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const locale = await getLocale()
  const supabase = await createServer()
  const params = await searchParams
  const menuTranslations = await getTranslations('menu')

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

  const products = data as IProduct[]
  return (
    <div className='m-10 flex flex-col h-full'>
      <Typography
        className='text-center font-medium font-playfair'
        size='xxxxl'
      >
        {menuTranslations('title')}
      </Typography>
      <Typography className='text-center mt-2'>
        {menuTranslations('first_subtitle')} <br />{' '}
        {menuTranslations('second_subtitle')}
      </Typography>
      {/* <span className='text-xl font-bold'>Categories</span> */}
      <div className='mt-8 flex flex-col items-center'>
        <CategoryList items={categories} activeSlug={activeSlug} />
      </div>
      {/* <p className='text-xl font-bold mt-8'>Products</p> */}
      <div className='mt-16 mb-16'>
        <ProductList items={products} />
      </div>
    </div>
  )
}
