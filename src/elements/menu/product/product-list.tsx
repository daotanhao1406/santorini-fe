import ProductItem from '@/elements/menu/product/product-item'

import { Product } from '@/types/product'

export default async function ProductList({ items }: { items: Product[] }) {
  if (!Array.isArray(items) || items.length === 0) {
    return <div>There's no products in this category</div>
  }
  return (
    <div className='grid gap-6 sm:gap-8 xl:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3'>
      {items.map((item) => (
        <ProductItem key={item.id} {...item} />
      ))}
    </div>
  )
}
