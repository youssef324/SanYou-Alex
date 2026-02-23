'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ShoppingBag, Menu, X } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const { data: session } = useSession()

  return (
    <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold bg-linear-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            GLOW
          </Link>

          {/* Desktop Menu - with proper spacing */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-purple-600 transition text-sm font-medium">Home</Link>
            <Link href="/products" className="text-gray-700 hover:text-purple-600 transition text-sm font-medium">Shop</Link>
            {session ? (
        <>
          <span>Welcome {session.user.name}</span>
          <button onClick={() => signOut()}>signOut</button>
        </>
      ) : (
        <Link href="/login">Login</Link>
      )}
          </div>

          {/* Cart */}
          <div className="flex items-center">
            <Link href="/cart" className="relative p-2 hover:bg-gray-100 rounded-full transition">
              <ShoppingBag className="w-5 h-5 text-gray-600" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden ml-2 p-2 hover:bg-gray-100 rounded-full transition"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-2 space-y-2">
            <Link href="/" className="block py-2 text-gray-700 hover:text-purple-600">Home</Link>
            <Link href="/products" className="block py-2 text-gray-700 hover:text-purple-600">Shop</Link>
            <Link href="/category/skincare" className="block py-2 text-gray-700 hover:text-purple-600">Skincare</Link>
            <Link href="/category/haircare" className="block py-2 text-gray-700 hover:text-purple-600">Haircare</Link>
          </div>
        </div>
      )}
    </nav>
  )
}