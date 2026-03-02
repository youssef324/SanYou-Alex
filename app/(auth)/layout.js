'use client'

import '../globals.css'

export default function AuthLayout({ children }) {
    return (
        <main className="min-h-screen">
            {children}
        </main>
    )
}
