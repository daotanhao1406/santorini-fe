'use client'

import { Button } from '@heroui/button'
import * as React from 'react'

export default function HomePage() {
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
      <p className='font-pacifico text-lg'>Buy $5.99</p>
      <p className='font-montserrat text-lg'>Buy $5.99</p>
    </main>
  )
}
