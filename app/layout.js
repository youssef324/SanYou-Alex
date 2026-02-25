import { NextAuthProvider } from '@/components/providers/SessionProvider'
import './globals.css'

export const metadata = {
  title: 'Smart Store',
  description: 'Premium Skincare and Beauty Store',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body suppressHydrationWarning={true}>
        <NextAuthProvider>
          {children}
        </NextAuthProvider>
      </body>
    </html>
  )
}