'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { ArrowLeft, CheckCircle, MapPin, Phone, FileText, ShoppingBag } from 'lucide-react'
import Link from 'next/link'

export default function CheckoutPage() {
    const [cart, setCart] = useState(null)
    const [loading, setLoading] = useState(true)
    const [placing, setPlacing] = useState(false)
    const [orderPlaced, setOrderPlaced] = useState(null)
    const [formData, setFormData] = useState({
        shippingAddress: '',
        customerPhone: '',
        notes: ''
    })
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login')
            return
        }
        fetch('/api/cart').then(r => r.json()).then(data => {
            setCart(data.cart)
            setLoading(false)
        })
    }, [status])

    const total = cart?.items?.reduce((sum, item) => sum + item.product.price * item.quantity, 0) || 0

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!formData.shippingAddress) {
            alert('Please enter a shipping address')
            return
        }
        setPlacing(true)
        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            const data = await res.json()
            if (res.ok) {
                setOrderPlaced(data)
                window.dispatchEvent(new Event('cart-updated'))
            } else {
                alert(data.error || 'Failed to place order')
            }
        } catch (error) {
            alert('Failed to place order')
        }
        setPlacing(false)
    }

    if (loading) {
        return (
            <div className="pt-20 max-w-3xl mx-auto px-4 py-8">
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl p-6 shadow-sm animate-pulse h-20" />
                    ))}
                </div>
            </div>
        )
    }

    // Order success state
    if (orderPlaced) {
        return (
            <div className="pt-20 max-w-lg mx-auto px-4 py-16 text-center">
                <div className="bg-white rounded-3xl p-10 shadow-sm fade-up">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
                    <p className="text-gray-500 mb-2">Thank you for your purchase</p>
                    <p className="text-sm font-medium text-purple-600 mb-8">Order #{orderPlaced.orderNumber}</p>
                    <Link href="/" className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        )
    }

    if (!cart?.items?.length) {
        return (
            <div className="pt-20 text-center py-20">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Your cart is empty</h3>
                <Link href="/" className="text-purple-600 hover:underline">Go Shopping</Link>
            </div>
        )
    }

    return (
        <div className="pt-20 max-w-4xl mx-auto px-4 py-8">
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Form */}
                <div className="lg:col-span-2">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-purple-500" /> Shipping Information
                            </h2>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Address *</label>
                                <textarea
                                    required
                                    rows={3}
                                    value={formData.shippingAddress}
                                    onChange={e => setFormData({ ...formData, shippingAddress: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-transparent"
                                    placeholder="Enter your full shipping address..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                                    <Phone className="w-3.5 h-3.5" /> Phone Number
                                </label>
                                <input
                                    type="tel"
                                    value={formData.customerPhone}
                                    onChange={e => setFormData({ ...formData, customerPhone: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-transparent"
                                    placeholder="+20 1XX XXX XXXX"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                                    <FileText className="w-3.5 h-3.5" /> Order Notes (optional)
                                </label>
                                <textarea
                                    rows={2}
                                    value={formData.notes}
                                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-transparent"
                                    placeholder="Any special instructions..."
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={placing}
                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 disabled:opacity-50 hover:-translate-y-0.5"
                        >
                            {placing ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                    Placing Order...
                                </span>
                            ) : `Place Order — LE ${total.toFixed(2)}`}
                        </button>
                    </form>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                        <div className="space-y-3 mb-4">
                            {cart.items.map(item => (
                                <div key={item.id} className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                        <img src={item.product.image || '/placeholder.jpeg'} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">{item.product.name}</p>
                                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="text-sm font-semibold">LE {(item.product.price * item.quantity).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-gray-100 pt-4 space-y-2">
                            <div className="flex justify-between text-sm"><span className="text-gray-500">Subtotal</span><span>LE {total.toFixed(2)}</span></div>
                            <div className="flex justify-between text-sm"><span className="text-gray-500">Shipping</span><span className="text-green-600">Free</span></div>
                            <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-100">
                                <span>Total</span>
                                <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">LE {total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
