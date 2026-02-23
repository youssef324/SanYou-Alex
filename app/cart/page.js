'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function CartPage() {
  const [cart, setCart] = useState({ items: [] })
  const [loading, setLoading] = useState(true)

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

  // Update quantity function
  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return

    try {
      const res = await fetch('/api/cart/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItemId: itemId, quantity: newQuantity })
      })

      if (res.ok) {
        // update local state
        setCart(prev => ({
          ...prev,
          items: prev.items.map(item => 
            item.id === itemId 
              ? { ...item, quantity: newQuantity }
              : item
          )
        }))
        fetchCart()
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to update quantity')
      }
    } catch (error) {
      console.error('Error updating quantity:', error)
      alert('Failed to update quantity')
    }
  }

  const removeItem = async (itemId) => {
    try {
      const res = await fetch('/api/cart/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItemId: itemId })
      })
      
      if (res.ok) {
        fetchCart()
      }
    } catch (error) {
      console.error('Error removing item:', error)
    }
  }

  if (loading) return <div className="pt-20 text-center">Loading cart...</div>

  return (
    <div className="pt-20 max-w-7xl mx-auto px-4">
      <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>
      
      {cart.items?.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Your cart is empty</p>
          <Link href="/" className="bg-purple-600 text-white px-6 py-2 rounded-lg">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {cart.items?.map(item => (
            <div key={item.id} className="flex gap-4 border-b pb-4">
              <div className="w-20 h-20 bg-gray-100 rounded"></div>
              <div className="flex-1">
                <h3 className="font-medium">{item.product.name}</h3>
                <p className="text-gray-600">LE {item.product.price}</p>
                
                {/* ✅ Quantity controls مع updateQuantity */}
                <div className="flex items-center gap-2 mt-2">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-2 py-1 border rounded hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-2 py-1 border rounded hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">LE {item.product.price * item.quantity}</p>
                <button 
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 hover:text-red-700 text-sm mt-2"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          
          <div className="text-right mt-8">
            <Link href="/checkout" className="bg-purple-600 text-white px-6 py-3 rounded-lg">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}