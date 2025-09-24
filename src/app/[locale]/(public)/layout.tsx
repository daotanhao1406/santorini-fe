import Header from '@/components/layout/header'

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className='flex-1'>
      <Header />
      <div className='flex-1'>{children}</div>
    </main>
  )
}
