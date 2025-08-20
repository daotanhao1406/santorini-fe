'use client'
import { Button } from '@heroui/button'
import { useEffect, useState } from 'react'

import { createClient } from '@/lib/supabase/client'

interface Product {
  name: string
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = async () => {
    setLoading(true)
    const supabase = createClient()
    const { data, error } = await supabase.from('products').select('name')
    if (error) {
      setError(error.message)
    } else {
      setProducts(data)
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  return (
    <main className='p-5 bg-background'>
      <Button radius='sm' color='primary'>
        Primary
      </Button>
      <Button radius='sm' color='secondary'>
        Secondary
      </Button>
      <Button radius='sm' color='success'>
        Success
      </Button>
      <Button radius='sm' color='default'>
        Default
      </Button>
      <Button radius='sm' color='danger'>
        Danger
      </Button>
      <Button radius='sm' color='warning'>
        Warning
      </Button>

      {products?.map((item, key) => (
        <div className='font-pacifico' key={key}>
          {key + 1}. {item.name}
        </div>
      ))}
    </main>
  )
}
