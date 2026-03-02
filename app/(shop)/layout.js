'use client'

import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'

export default function ShopLayout({ children }) {
    return (
        <>
            <Navbar />
            <main style={{ minHeight: 'calc(100vh - 400px)' }}>{children}</main>
            <Footer />
        </>
    )
}
