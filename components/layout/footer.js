import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">Smart Store</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your premium destination for quality beauty & skincare products.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold text-white mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/" className="hover:text-purple-400 transition">All Products</Link></li>
              <li><Link href="/?category=skincare" className="hover:text-purple-400 transition">Skincare</Link></li>
              <li><Link href="/?category=haircare" className="hover:text-purple-400 transition">Haircare</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-semibold text-white mb-4">Account</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/login" className="hover:text-purple-400 transition">Sign In</Link></li>
              <li><Link href="/register" className="hover:text-purple-400 transition">Create Account</Link></li>
              <li><Link href="/cart" className="hover:text-purple-400 transition">Shopping Cart</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-white mb-4">Stay Updated</h4>
            <p className="text-sm text-gray-400 mb-4">Get 10% off your first order</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Email"
                className="flex-1 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-l-xl focus:outline-none focus:border-purple-500 text-sm text-white placeholder-gray-500 transition"
              />
              <button className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-4 py-2.5 rounded-r-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all">
                →
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-500">
          <p>© 2026 Smart Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}