import { redirect } from 'next/navigation'

import { createServer } from '@/lib/supabase/server'

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createServer()

  const { data, error } = await supabase.auth.getClaims()

  if (error || !data?.claims) {
    redirect('/auth/login')
  }
  return <main className='flex-1'>{children}</main>
}
