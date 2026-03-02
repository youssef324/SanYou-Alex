'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, CreditCard, ShoppingBag, Truck, Shield, Plus } from 'lucide-react'

export default function CheckoutPage() {
    const [cart, setCart] = useState(null)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState('CARD') // 'CARD' or 'CASH'
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', address: '', city: 'Cairo'
    })
    const router = useRouter()

    useEffect(() => {
        fetch('/api/cart')
            .then(r => r.json())
            .then(data => {
                setCart(data.cart)
                setLoading(false)
            })
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, paymentMethod })
            })
            const data = await res.json()
            if (res.ok) {
                if (data.stripeUrl) {
                    window.location.href = data.stripeUrl;
                    return;
                }
                router.push(`/orders/success?id=${data.orderNumber}`)
            } else {
                alert(data.error || 'Checkout failed')
            }
        } catch (error) {
            alert('Checkout failed')
        }
        setSubmitting(false)
    }

    if (loading) return (
        <div className="pt-32 text-center h-screen bg-[#fdf8f6]/30">
            <div className="w-12 h-12 border-4 border-[#e8a4b8] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400 font-serif italic">Finalizing your selection...</p>
        </div>
    )

    const total = cart?.items?.reduce((sum, item) => {
        const price = item.product.discount > 0
            ? item.product.price * (1 - item.product.discount / 100)
            : item.product.price
        return sum + (price * item.quantity)
    }, 0) || 0

    return (
        <div className="pt-24 pb-20 bg-[#fdf8f6]/30 min-h-screen">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center gap-4 mb-12">
                    <button onClick={() => router.back()} className="p-3 bg-white rounded-2xl shadow-sm text-gray-400 hover:text-[#e8a4b8] transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-4xl font-serif font-bold text-[#2d1b2e]">Checkout</h1>
                        <p className="text-xs font-bold text-[#e8a4b8] uppercase tracking-[0.2em] mt-1">Experience Elegant Shopping</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-8 space-y-8">
                        {/* Shipping Form */}
                        <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-purple-50">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                                    <Truck className="w-5 h-5" />
                                </div>
                                <h2 className="text-2xl font-serif font-bold text-[#2d1b2e]">Shipping Destination</h2>
                            </div>

                            <form id="checkout-form" onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 px-1">Full Name</label>
                                    <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Enter your full name"
                                        className="w-full px-6 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-[#e8a4b8]/50 transition-all text-sm font-medium" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 px-1">Email Address</label>
                                    <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="you@example.com"
                                        className="w-full px-6 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-[#e8a4b8]/50 transition-all text-sm font-medium" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 px-1">Phone Number</label>
                                    <input type="tel" required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="e.g. 01234567890"
                                        className="w-full px-6 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-[#e8a4b8]/50 transition-all text-sm font-medium" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 px-1">Delivery Address</label>
                                    <textarea required rows={3} value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })}
                                        placeholder="Floor, Apartment, Street name, Area"
                                        className="w-full px-6 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-[#e8a4b8]/50 transition-all text-sm font-medium" />
                                </div>
                            </form>
                        </div>

                        {/* Payment Options */}
                        <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-purple-50">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                                    <Shield className="w-5 h-5" />
                                </div>
                                <h2 className="text-2xl font-serif font-bold text-[#2d1b2e]">Secured Payment</h2>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('CARD')}
                                    className={`p-6 rounded-[2rem] border-2 text-left transition-all relative overflow-hidden group ${paymentMethod === 'CARD' ? 'border-[#e8a4b8] bg-purple-50/30' : 'border-gray-50 hover:border-purple-100'}`}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-[#e8a4b8]">
                                            <CreditCard className="w-6 h-6" />
                                        </div>
                                        {paymentMethod === 'CARD' && <div className="w-6 h-6 bg-[#e8a4b8] rounded-full flex items-center justify-center shadow-lg"><Plus className="w-3.5 h-3.5 text-white rotate-45" /></div>}
                                    </div>
                                    <h3 className="font-black text-gray-900 mb-1">Visa / Credit Card</h3>
                                    <p className="text-gray-400 text-xs leading-relaxed">Secured by Stripe encryption. Worldwide cards accepted.</p>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('CASH')}
                                    className={`p-6 rounded-[2rem] border-2 text-left transition-all relative overflow-hidden group ${paymentMethod === 'CASH' ? 'border-[#c9a96e] bg-amber-50/30' : 'border-gray-50 hover:border-amber-100'}`}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-[#c9a96e]">
                                            <ShoppingBag className="w-6 h-6" />
                                        </div>
                                        {paymentMethod === 'CASH' && <div className="w-6 h-6 bg-[#c9a96e] rounded-full flex items-center justify-center shadow-lg"><Plus className="w-3.5 h-3.5 text-white rotate-45" /></div>}
                                    </div>
                                    <h3 className="font-black text-gray-900 mb-1">Cash on Delivery</h3>
                                    <p className="text-gray-400 text-xs leading-relaxed">Pay when your beauty products arrive at your door.</p>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-4 lg:sticky lg:top-28 h-fit">
                        <div className="bg-[#2d1b2e] text-white rounded-[3rem] p-10 shadow-3xl shadow-purple-900/40 relative overflow-hidden">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl" />

                            <h2 className="text-2xl font-serif font-bold mb-8 border-b border-white/10 pb-6">Your Collection</h2>

                            <div className="max-h-60 overflow-y-auto pr-2 mb-8 space-y-4 scrollbar-hide">
                                {cart?.items?.map(item => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="w-12 h-12 bg-white/10 rounded-xl overflow-hidden flex-shrink-0">
                                            <img src={item.product.image} className="w-full h-full object-cover" alt="" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold truncate">{item.product.name}</p>
                                            <p className="text-[10px] text-white/40">Qty: {item.quantity} × LE {item.product.discount > 0 ? (item.product.price * (1 - item.product.discount / 100)).toFixed(0) : item.product.price}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 mb-10 border-t border-white/10 pt-8">
                                <div className="flex justify-between text-white/60 font-medium">
                                    <span>Subtotal</span>
                                    <span>LE {total.toFixed(2)}</span>
                                </div>
                                <div className="h-px bg-white/10 my-6" />
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-white/40 text-xs font-black uppercase tracking-[0.2em] mb-1">Final Total</p>
                                        <p className="text-5xl font-black">LE {total.toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                form="checkout-form"
                                disabled={submitting}
                                className="w-full bg-white text-[#2d1b2e] h-16 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-[#e8a4b8] hover:text-white transition-all duration-500 shadow-xl disabled:opacity-50"
                            >
                                {submitting ? 'PROCESSING...' : paymentMethod === 'CARD' ? 'PAY NOW WITH STRIPE' : 'CONFIRM ORDER'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
