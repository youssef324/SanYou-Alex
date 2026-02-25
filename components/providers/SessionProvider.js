'use client'

import { SessionProvider } from 'next-auth/react'

export function NextAuthProvider({ children, session }) {
    return (
        <SessionProvider session={session}>
            {children}
        </SessionProvider>
    )
}
