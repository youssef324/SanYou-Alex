import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 mt-20">
      <div className="modern-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-4">
              GLOW
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Your premium destination for clean, cruelty-free beauty products.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/products" className="hover:text-purple-600">All Products</Link></li>
              <li><Link href="/category/skincare" className="hover:text-purple-600">Skincare</Link></li>
              <li><Link href="/category/haircare" className="hover:text-purple-600">Haircare</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/about" className="hover:text-purple-600">About</Link></li>
              <li><Link href="/contact" className="hover:text-purple-600">Contact</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold mb-4">Stay Updated</h4>
            <p className="text-sm text-gray-600 mb-4">Get 10% off your first order</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Email"
                className="flex-1 px-4 py-2 border border-gray-200 rounded-l-lg focus:outline-none focus:border-purple-400"
              />
              <button className="bg-purple-600 text-white px-4 py-2 rounded-r-lg hover:bg-purple-700 transition">
                →
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-12 pt-8 text-center text-sm text-gray-500">
          <p>© 2024 GLOW. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}