'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { ShoppingBag, Menu, X, Heart, Search, User, LogOut, Shield } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { data: session } = useSession()
  const searchRef = useRef(null)

  // Fetch cart count
  const fetchCartCount = async () => {
    try {
      const res = await fetch('/api/cart')
      const data = await res.json()
      const count = data.cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0
      setCartCount(count)
    } catch (e) {
      // silent
    }
  }

  useEffect(() => {
    fetchCartCount()
    const handleUpdate = () => fetchCartCount()
    window.addEventListener('cart-updated', handleUpdate)

    // Scroll listener
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('cart-updated', handleUpdate)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    if (showSearch && searchRef.current) {
      searchRef.current.focus()
    }
  }, [showSearch])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/?search=${encodeURIComponent(searchQuery.trim())}`
      setShowSearch(false)
      setSearchQuery('')
    }
  }

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled
        ? 'bg-white/95 backdrop-blur-xl shadow-lg shadow-black/5'
        : 'bg-white/80 backdrop-blur-md'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow-md shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-all duration-300 group-hover:scale-105">
              <ShoppingBag className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              Smart Store
            </span>
          </Link>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100/80 border-0 rounded-xl text-sm focus:ring-2 focus:ring-purple-500/50 focus:bg-white transition-all duration-300 placeholder-gray-400"
              />
            </form>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link href="/" className="px-3 py-2 text-gray-600 hover:text-purple-600 transition-colors text-sm font-medium rounded-lg hover:bg-purple-50">
              Home
            </Link>

            {session && (
              <Link href="/favourites" className="px-3 py-2 text-gray-600 hover:text-pink-500 transition-colors rounded-lg hover:bg-pink-50 relative">
                <Heart className="w-5 h-5" />
              </Link>
            )}

            <Link href="/cart" className="px-3 py-2 text-gray-600 hover:text-purple-600 transition-colors rounded-lg hover:bg-purple-50 relative">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0 right-0.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-[10px] font-bold w-4.5 h-4.5 flex items-center justify-center rounded-full shadow-sm animate-bounce-once">
                  {cartCount}
                </span>
              )}
            </Link>

            <div className="w-px h-6 bg-gray-200 mx-2" />

            {session ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-xl">
                  <div className="w-7 h-7 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{session.user.name?.[0]?.toUpperCase() || 'U'}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate">{session.user.name}</span>
                </div>
                {session.user.role === 1 && (
                  <Link href="/admin" className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition" title="Admin Panel">
                    <Shield className="w-4 h-4" />
                  </Link>
                )}
                <button
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link href="/login" className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:-translate-y-0.5">
                <User className="w-4 h-4" />
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile: Search + Cart + Menu */}
          <div className="flex items-center gap-2 md:hidden">
            <button onClick={() => setShowSearch(!showSearch)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition">
              <Search className="w-5 h-5" />
            </button>
            <Link href="/cart" className="relative p-2 hover:bg-gray-100 rounded-full transition">
              <ShoppingBag className="w-5 h-5 text-gray-600" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-[10px] font-bold w-4.5 h-4.5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {showSearch && (
        <div className="md:hidden px-4 pb-3 border-t border-gray-100 bg-white">
          <form onSubmit={handleSearch} className="relative mt-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              ref={searchRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-purple-500/50 focus:bg-white transition-all"
            />
          </form>
        </div>
      )}

      {/* Mobile Menu */}
      <div className={`md:hidden bg-white border-t border-gray-100 overflow-hidden transition-all duration-300 ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
        <div className="px-4 py-3 space-y-1">
          <Link href="/" className="block py-2.5 px-3 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition" onClick={() => setIsMenuOpen(false)}>Home</Link>
          {session && (
            <Link href="/favourites" className="flex items-center gap-2 py-2.5 px-3 text-gray-700 hover:text-pink-500 hover:bg-pink-50 rounded-lg transition" onClick={() => setIsMenuOpen(false)}>
              <Heart className="w-4 h-4" /> Favourites
            </Link>
          )}
          <div className="border-t border-gray-100 my-2" />
          {session ? (
            <>
              <div className="flex items-center gap-2 py-2 px-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">{session.user.name?.[0]?.toUpperCase()}</span>
                </div>
                <span className="font-medium text-gray-700">{session.user.name}</span>
              </div>
              {session.user.role === 1 && (
                <Link href="/admin" className="flex items-center gap-2 py-2.5 px-3 text-purple-600 hover:bg-purple-50 rounded-lg transition" onClick={() => setIsMenuOpen(false)}>
                  <Shield className="w-4 h-4" /> Admin Panel
                </Link>
              )}
              <button onClick={() => signOut({ callbackUrl: '/login' })} className="flex items-center gap-2 w-full py-2.5 px-3 text-red-500 hover:bg-red-50 rounded-lg transition">
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </>
          ) : (
            <Link href="/login" className="block text-center py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-medium" onClick={() => setIsMenuOpen(false)}>
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}