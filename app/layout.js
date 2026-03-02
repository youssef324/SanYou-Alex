import { NextAuthProvider } from '@/components/providers/SessionProvider'
import './globals.css'

export const metadata = {
  title: 'SanYou - Beauty & Skincare',
  description: "SanYou is not just Make-up or Skincare - it's a feeling of elegance you can wear everyday",
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
