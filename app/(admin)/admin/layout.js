'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut, ShoppingBag, ChevronRight } from 'lucide-react'
import { signOut } from 'next-auth/react'

const sidebarLinks = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { href: '/admin/users', label: 'Users', icon: Users },
]

export default function AdminLayout({ children }) {
    const { data: session, status } = useSession()
    const router = useRouter()
    const pathname = usePathname()
    const [sidebarOpen, setSidebarOpen] = useState(true)

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login')
        } else if (status === 'authenticated' && session?.user?.role !== 1) {
            router.push('/')
        }
    }, [status, session])

    if (status === 'loading' || status === 'unauthenticated' || session?.user?.role !== 1) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-500">Loading admin panel...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className={`admin-sidebar text-white flex flex-col transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
                {/* Logo */}
                <div className="p-5 border-b border-white/10">
                    <Link href="/admin" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                            <ShoppingBag className="w-5 h-5 text-white" />
                        </div>
                        {sidebarOpen && (
                            <div>
                                <span className="font-bold text-lg">Smart Store</span>
                                <p className="text-xs text-purple-200">Admin Panel</p>
                            </div>
                        )}
                    </Link>
                </div>

                {/* Nav */}
                <nav className="flex-1 py-4 px-3 space-y-1">
                    {sidebarLinks.map(link => {
                        const Icon = link.icon
                        const isActive = pathname === link.href || (link.href !== '/admin' && pathname?.startsWith(link.href))
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${isActive
                                        ? 'bg-white/15 text-white shadow-md'
                                        : 'text-purple-200 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                <Icon className="w-5 h-5 flex-shrink-0" />
                                {sidebarOpen && <span className="text-sm font-medium">{link.label}</span>}
                                {isActive && sidebarOpen && <ChevronRight className="w-4 h-4 ml-auto" />}
                            </Link>
                        )
                    })}
                </nav>

                {/* Bottom */}
                <div className="p-3 border-t border-white/10">
                    <Link href="/" className="flex items-center gap-3 px-3 py-3 text-purple-200 hover:text-white hover:bg-white/10 rounded-xl transition text-sm">
                        <ShoppingBag className="w-5 h-5 flex-shrink-0" />
                        {sidebarOpen && <span>View Store</span>}
                    </Link>
                    <button
                        onClick={() => signOut({ callbackUrl: '/login' })}
                        className="w-full flex items-center gap-3 px-3 py-3 text-purple-200 hover:text-red-300 hover:bg-white/10 rounded-xl transition text-sm"
                    >
                        <LogOut className="w-5 h-5 flex-shrink-0" />
                        {sidebarOpen && <span>Sign Out</span>}
                    </button>
                </div>
            </aside>

            {/* Main */}
            <main className="flex-1 overflow-auto">
                {/* Top Bar */}
                <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg transition">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm font-bold">{session.user.name?.[0]?.toUpperCase()}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-700">{session.user.name}</span>
                    </div>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </main>
        </div>
    )
}
