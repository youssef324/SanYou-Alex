'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { ShoppingBag, Menu, X, Heart, Search, User, LogOut, Shield, Sparkles } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const { data: session } = useSession()
  const [showMobileSearch, setShowMobileSearch] = useState(false)

  const fetchCartCount = async () => {
    try {
      const res = await fetch('/api/cart')
      const data = await res.json()
      const count = data.cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0
      setCartCount(count)
    } catch (e) { /* silent */ }
  }

  useEffect(() => {
    fetchCartCount()
    const handleUpdate = () => fetchCartCount()
    window.addEventListener('cart-updated', handleUpdate)
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('cart-updated', handleUpdate)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/?search=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  return (
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-700 ${scrolled ? 'py-3' : 'py-6'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`relative flex items-center justify-between transition-all duration-500 rounded-[2rem] px-8 h-20 overflow-hidden ${scrolled
            ? 'bg-white/70 backdrop-blur-2xl shadow-2xl shadow-purple-900/5 border border-white/50'
            : 'bg-white shadow-xl shadow-purple-900/5 border border-purple-50/50'
          }`}>
          {/* Decorative gradients */}
          <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-[#e8a4b8]/10 to-transparent pointer-events-none" />

          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-4 group relative z-10">
            <div className="w-12 h-12 bg-[#2d1b2e] rounded-2xl flex items-center justify-center shadow-lg shadow-purple-900/20 group-hover:scale-110 transition-transform duration-500 group-hover:rotate-3">
              <Sparkles className="w-6 h-6 text-[#e8a4b8]" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-serif font-black tracking-tighter text-[#2d1b2e] leading-none mb-0.5">SanYou</span>
              <span className="text-[8px] font-black uppercase tracking-[0.3em] text-[#e8a4b8] opacity-80 leading-none">The Feeling</span>
            </div>
          </Link>

          {/* Desktop Search */}
          <div className="hidden lg:flex flex-1 max-w-md mx-12 relative z-10">
            <form onSubmit={handleSearch} className="relative w-full group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-[#e8a4b8] transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Seek elegance..."
                className="w-full pl-14 pr-6 py-4 bg-gray-50/50 border-0 rounded-2xl text-[13px] font-medium focus:ring-2 focus:ring-[#e8a4b8]/20 focus:bg-white transition-all duration-500 placeholder-gray-300"
              />
            </form>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2 relative z-10">
            <Link href="/" className="px-6 py-3 text-gray-400 hover:text-[#2d1b2e] transition-all text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-gray-50">
              Collection
            </Link>

            <Link href="/account/profile" title="Wishlist" className="p-3.5 text-gray-400 hover:text-[#e8a4b8] transition-all rounded-xl hover:bg-pink-50/50 group">
              <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </Link>

            <Link href="/cart" className="p-3.5 text-gray-400 hover:text-[#2d1b2e] transition-all rounded-xl hover:bg-purple-50 relative group">
              <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#2d1b2e] text-[#e8a4b8] text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-lg border-2 border-white">
                  {cartCount}
                </span>
              )}
            </Link>

            <div className="w-px h-8 bg-gray-100 mx-4" />

            {session ? (
              <div className="flex items-center gap-3">
                <Link href="/account/profile" className="flex items-center gap-4 pl-2 pr-6 py-2 bg-gray-50/80 hover:bg-white rounded-2xl border border-transparent hover:border-purple-50 transition-all shadow-sm hover:shadow-xl hover:shadow-purple-900/5 group">
                  <div className="w-10 h-10 bg-[#2d1b2e] rounded-xl flex items-center justify-center text-[#e8a4b8] shadow-lg group-hover:scale-105 transition-transform">
                    {session.user.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-[#2d1b2e] tracking-tight truncate max-w-[80px]">{session.user.name}</span>
                    <span className="text-[10px] text-gray-400 font-medium">Account</span>
                  </div>
                </Link>
                {session.user.role === 1 && (
                  <Link href="/admin" className="p-4 bg-purple-50 text-purple-600 rounded-2xl hover:bg-purple-600 hover:text-white transition-all shadow-sm">
                    <Shield className="w-5 h-5" />
                  </Link>
                )}
              </div>
            ) : (
              <Link href="/login" className="px-8 py-4 bg-[#2d1b2e] text-white text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-black transition-all shadow-xl shadow-purple-900/20 active:scale-95">
                Portal Access
              </Link>
            )}
          </div>

          {/* Mobile Interactions */}
          <div className="flex items-center gap-3 lg:hidden relative z-10">
            <button onClick={() => setShowMobileSearch(!showMobileSearch)} className="p-3 text-gray-400 hover:bg-gray-50 rounded-xl">
              <Search className="w-5 h-5" />
            </button>
            <Link href="/cart" className="relative p-3 text-gray-400 hover:bg-gray-50 rounded-xl">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#2d1b2e] text-[#e8a4b8] text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">
                  {cartCount}
                </span>
              )}
            </Link>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-3 bg-[#2d1b2e] text-white rounded-xl shadow-lg">
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Overlay */}
        {showMobileSearch && (
          <div className="lg:hidden mt-4 bg-white/95 backdrop-blur-xl rounded-[1.5rem] p-4 shadow-2xl border border-purple-50 fade-up">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Seek beauty..."
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-xl text-sm font-medium focus:ring-0"
              />
            </form>
          </div>
        )}

        {/* Mobile Main Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 bg-[#2d1b2e] rounded-[2.5rem] p-10 shadow-2xl space-y-8 fade-up text-white overflow-hidden relative border border-white/10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#e8a4b8]/10 rounded-full blur-3xl -mr-32 -mt-32" />

            <div className="space-y-4">
              <Link href="/" onClick={() => setIsMenuOpen(false)} className="block text-4xl font-serif font-bold hover:text-[#e8a4b8] transition-colors">Boutique</Link>
              <Link href="/account/profile" onClick={() => setIsMenuOpen(false)} className="block text-4xl font-serif font-bold hover:text-[#e8a4b8] transition-colors">Sanctuaries</Link>
              <Link href="/cart" onClick={() => setIsMenuOpen(false)} className="block text-4xl font-serif font-bold hover:text-[#e8a4b8] transition-colors">Curations</Link>
            </div>

            <div className="h-px bg-white/10 w-full" />

            {session ? (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-[#e8a4b8] text-2xl font-serif font-bold">
                    {session.user.name?.[0]}
                  </div>
                  <div>
                    <p className="text-xl font-serif font-bold">{session.user.name}</p>
                    <p className="text-xs text-white/50">{session.user.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Link href="/account/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-center gap-2 py-4 bg-white/5 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-white/10">
                    My Account
                  </Link>
                  <button onClick={() => signOut()} className="flex items-center justify-center gap-2 py-4 bg-red-500/10 text-red-400 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-red-500/20">
                    Exit Portal
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/login" onClick={() => setIsMenuOpen(false)} className="block w-full py-6 bg-[#e8a4b8] text-white text-center rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl">
                Enter Boutique
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}