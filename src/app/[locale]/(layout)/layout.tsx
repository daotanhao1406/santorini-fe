import Header from '@/components/layout/header'

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className='flex flex-col flex-1 h-full'>
      <Header />
      <main className='font-montserrat h-full w-full max-w-7xl mx-auto'>
        {children}
      </main>
    </main>
  )
}
