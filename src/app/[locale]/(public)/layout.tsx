import Header from '@/components/layout/header'

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className='font-montserrat'>
      <Header />
      <div className='flex-1 w-full max-w-[1280px] mx-auto'>{children}</div>
    </main>
  )
}
