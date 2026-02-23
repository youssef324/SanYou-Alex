'use client'

import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import { SessionProvider } from 'next-auth/react'
import './globals.css'

export default function RootLayout({ children, session }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body suppressHydrationWarning={true}>
        <SessionProvider session={session}>
          <Navbar />
          <main style={{ minHeight: 'calc(100vh - 400px)' }}>{children}</main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  )
}