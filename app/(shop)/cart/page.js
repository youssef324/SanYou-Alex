'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, ArrowRight } from 'lucide-react'

export default function CartPage() {
    const [cart, setCart] = useState(null)
    const [loading, setLoading] = useState(true)

    const fetchCart = async () => {
        try {
            const res = await fetch('/api/cart')
            const data = await res.json()
            setCart(data.cart)
        } catch (error) {
            console.error('Error:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchCart() }, [])

    const updateQuantity = async (itemId, quantity) => {
        if (quantity < 1) return
        try {
            await fetch('/api/cart/update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cartItemId: itemId, quantity })
            })
            fetchCart()
            window.dispatchEvent(new Event('cart-updated'))
        } catch (error) {
            console.error('Error:', error)
        }
    }

    const removeItem = async (itemId) => {
        try {
            await fetch('/api/cart/remove', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cartItemId: itemId })
            })
            fetchCart()
            window.dispatchEvent(new Event('cart-updated'))
        } catch (error) {
            console.error('Error:', error)
        }
    }

    const total = cart?.items?.reduce((sum, item) => sum + item.product.price * item.quantity, 0) || 0

    if (loading) {
        return (
            <div className="pt-20 max-w-4xl mx-auto px-4 py-8">
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl p-6 shadow-sm animate-pulse flex gap-4">
                            <div className="w-24 h-24 bg-gray-200 rounded-xl" />
                            <div className="flex-1 space-y-3">
                                <div className="h-4 bg-gray-200 rounded w-1/2" />
                                <div className="h-3 bg-gray-200 rounded w-1/4" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="pt-20 max-w-4xl mx-auto px-4 py-8">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/" className="p-2 hover:bg-gray-100 rounded-lg transition">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
                    <p className="text-gray-500 text-sm">{cart?.items?.length || 0} items</p>
                </div>
            </div>

            {!cart?.items?.length ? (
                <div className="text-center py-20">
                    <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Your cart is empty</h3>
                    <p className="text-gray-500 mb-6">Start adding products to your cart!</p>
                    <Link href="/" className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
                        Browse Products
                    </Link>
                </div>
            ) : (
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.items.map((item, i) => (
                            <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm flex gap-4 fade-up hover:shadow-md transition-all" style={{ animationDelay: `${i * 0.05}s` }}>
                                <Link href={`/products/${item.product.id}`} className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                                    <img src={item.product.image || '/placeholder.jpeg'} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform" />
                                </Link>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold text-gray-900 text-sm">{item.product.name}</h3>
                                            <p className="text-xs text-purple-500">{item.product.category?.name}</p>
                                        </div>
                                        <button onClick={() => removeItem(item.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between mt-3">
                                        <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden">
                                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1.5 hover:bg-gray-200 transition">
                                                <Minus className="w-3.5 h-3.5" />
                                            </button>
                                            <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1.5 hover:bg-gray-200 transition">
                                                <Plus className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                        <p className="font-bold text-gray-900">LE {(item.product.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                            <div className="space-y-3 pb-4 border-b border-gray-100">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span className="font-medium">LE {total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Shipping</span>
                                    <span className="text-green-600 font-medium">Free</span>
                                </div>
                            </div>
                            <div className="flex justify-between mt-4 text-lg font-bold">
                                <span>Total</span>
                                <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">LE {total.toFixed(2)}</span>
                            </div>
                            <Link href="/checkout" className="mt-6 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:-translate-y-0.5">
                                Proceed to Checkout <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
