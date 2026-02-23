'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function CheckoutPage() {
  const [cart, setCart] = useState({ items: [] })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: ''
  })

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      const res = await fetch('/api/cart')
      const data = await res.json()
      setCart(data.cart || { items: [] })
    } catch (error) {
      console.error('Error fetching cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const calculateTotal = () => {
    return cart.items?.reduce((sum, item) => sum + (item.product.price * item.quantity), 0) || 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    // هنا هتضيف إنشاء order بعدين
    alert('Order placed successfully! (Demo)')
    router.push('/')
  }

  if (loading) {
    return <div className="pt-20 text-center">Loading checkout...</div>
  }

  if (cart.items?.length === 0) {
    return (
      <div className="pt-20 text-center">
        <p className="text-gray-600 mb-4">Your cart is empty</p>
        <Link href="/products" className="bg-purple-600 text-white px-6 py-2 rounded-lg">
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="pt-20 max-w-7xl mx-auto px-4 pb-12">
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Shipping Form */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border rounded-lg"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50"
            >
              {submitting ? 'Processing...' : 'Place Order'}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            {cart.items?.map(item => (
              <div key={item.id} className="flex justify-between py-2 border-b">
                <div>
                  <p className="font-medium">{item.product.name}</p>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium">LE {item.product.price * item.quantity}</p>
              </div>
            ))}
            
            <div className="flex justify-between pt-4 font-bold text-lg">
              <span>Total</span>
              <span>LE {calculateTotal()}</span>
            </div>
          </div>

          <Link href="/cart" className="block text-center mt-4 text-purple-600 hover:underline">
            ← Back to Cart
          </Link>
        </div>
      </div>
    </div>
  )
}