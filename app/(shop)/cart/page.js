'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Minus, Plus, ShoppingBag, ArrowLeft, ArrowRight, X, Shield, Truck } from 'lucide-react'

export default function CartPage() {
    const [items, setItems] = useState([])
    const [recommendations, setRecommendations] = useState([])
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)
    const router = useRouter()

    const fetchCartAndRecs = async () => {
        try {
            const res = await fetch('/api/cart')
            const data = await res.json()
            setItems(data.cart?.items || [])

            // Fetch recommendations based on cart categories
            const prodRes = await fetch('/api/products')
            const allProds = await prodRes.json()

            if (data.cart?.items?.length > 0) {
                const catIds = [...new Set(data.cart.items.map(i => i.product.categoryId))]
                const recs = allProds
                    .filter(p => catIds.includes(p.categoryId) && !data.cart.items.find(i => i.productId === p.id))
                    .slice(0, 4)
                setRecommendations(recs)
            } else {
                setRecommendations(allProds.slice(0, 4))
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCartAndRecs()
    }, [])

    const updateQuantity = async (itemId, newQty) => {
        if (newQty < 1) return
        setUpdating(true)
        await fetch('/api/cart/update', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cartItemId: itemId, quantity: newQty })
        })
        await fetchCartAndRecs()
        window.dispatchEvent(new Event('cart-updated'))
        setUpdating(false)
    }

    const removeItem = async (itemId) => {
        setUpdating(true)
        await fetch('/api/cart/remove', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cartItemId: itemId })
        })
        window.dispatchEvent(new Event('cart-updated'))
        await fetchCartAndRecs()
        setUpdating(false)
    }

    const subtotal = items.reduce((sum, item) => {
        const price = item.product.discount > 0
            ? item.product.price * (1 - item.product.discount / 100)
            : item.product.price
        return sum + (price * item.quantity)
    }, 0)

    if (loading) return (
        <div className="pt-32 text-center h-screen bg-[#fdf8f6]/30">
            <div className="w-12 h-12 border-4 border-[#e8a4b8] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400 font-serif italic">Preparing your collection...</p>
        </div>
    )

    if (items.length === 0) {
        return (
            <div className="pt-32 max-w-7xl mx-auto px-4 text-center min-h-screen">
                <div className="bg-white rounded-[3rem] py-20 px-4 border border-purple-50 shadow-sm">
                    <ShoppingBag className="w-20 h-20 text-gray-100 mx-auto mb-6" />
                    <h2 className="text-3xl font-serif font-bold text-[#2d1b2e] mb-4">Your collection is empty</h2>
                    <p className="text-gray-500 mb-10 max-w-sm mx-auto">Explore our premium selection of beauty and skincare essentials to find your perfect match.</p>
                    <Link href="/" className="inline-flex items-center gap-2 bg-[#2d1b2e] text-white px-10 py-4 rounded-full font-bold shadow-xl hover:bg-black transition-all">
                        <ArrowLeft className="w-4 h-4" /> Start Shopping
                    </Link>
                </div>

                {recommendations.length > 0 && (
                    <div className="mt-20 text-left pb-20">
                        <h3 className="text-2xl font-serif font-bold text-[#2d1b2e] mb-8">Curated for You</h3>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {recommendations.map(p => (
                                <Link key={p.id} href={`/products/${p.id}`} className="group space-y-4">
                                    <div className="aspect-[4/5] bg-white rounded-3xl overflow-hidden shadow-sm border border-purple-50">
                                        <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    </div>
                                    <div className="px-2">
                                        <p className="text-[10px] font-bold text-[#e8a4b8] uppercase tracking-widest">{p.category?.name}</p>
                                        <h4 className="font-bold text-sm text-gray-900 truncate">{p.name}</h4>
                                        <p className="font-black text-gray-900 mt-1">LE {p.price}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="pt-24 pb-20 bg-[#fdf8f6]/30 min-h-screen">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between mb-12">
                    <h1 className="text-4xl font-serif font-bold text-[#2d1b2e]">Your Bag</h1>
                    <p className="text-sm font-bold text-[#e8a4b8] uppercase tracking-widest">{items.length} Items Selected</p>
                </div>

                <div className="grid lg:grid-cols-12 gap-12 items-start">
                    <div className="lg:col-span-8 space-y-6">
                        {items.map((item) => {
                            const currentPrice = item.product.discount > 0
                                ? (item.product.price * (1 - item.product.discount / 100))
                                : item.product.price;

                            return (
                                <div key={item.id} className="bg-white rounded-[2.5rem] p-6 sm:p-8 flex flex-col sm:flex-row gap-8 shadow-sm border border-purple-50 group transition-all hover:shadow-xl hover:shadow-purple-900/5">
                                    <Link href={`/products/${item.product.id}`} className="w-full sm:w-40 aspect-[4/5] bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0 shadow-inner">
                                        <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" />
                                    </Link>

                                    <div className="flex-1 flex flex-col">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="text-[10px] font-bold text-[#e8a4b8] uppercase tracking-widest mb-1">{item.product.category?.name}</p>
                                                <Link href={`/products/${item.product.id}`}>
                                                    <h3 className="text-xl font-bold text-[#2d1b2e] group-hover:text-[#e8a4b8] transition-colors">{item.product.name}</h3>
                                                </Link>
                                                {item.color && (
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <span className="text-xs font-bold text-gray-400">Color:</span>
                                                        <span className="text-xs font-black text-gray-700 uppercase tracking-tighter">{item.color}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <button onClick={() => removeItem(item.id)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition">
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>

                                        <div className="mt-auto pt-6 flex flex-wrap items-end justify-between gap-4">
                                            <div className="flex items-center bg-gray-50 border border-purple-50 rounded-2xl p-1 shadow-inner">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    disabled={updating || item.quantity <= 1}
                                                    className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-[#2d1b2e] hover:bg-white rounded-xl transition shadow-sm bg-transparent border-0"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="w-12 text-center font-black text-gray-900">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    disabled={updating}
                                                    className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-[#2d1b2e] hover:bg-white rounded-xl transition shadow-sm bg-transparent border-0"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <div className="text-right">
                                                {item.product.discount > 0 && (
                                                    <p className="text-xs text-gray-300 line-through font-medium">LE {(item.product.price * item.quantity).toFixed(2)}</p>
                                                )}
                                                <p className="text-2xl font-black text-gray-900">LE {(currentPrice * item.quantity).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}

                        {/* Recommendations */}
                        {recommendations.length > 0 && (
                            <div className="pt-12">
                                <h3 className="text-2xl font-serif font-bold text-[#2d1b2e] mb-8">You May Also Like</h3>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                    {recommendations.map(p => (
                                        <Link key={p.id} href={`/products/${p.id}`} className="group space-y-3">
                                            <div className="aspect-square bg-white rounded-3xl overflow-hidden shadow-sm border border-purple-50">
                                                <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                            </div>
                                            <div className="px-1 text-center">
                                                <h4 className="font-bold text-xs text-gray-900 truncate">{p.name}</h4>
                                                <p className="font-black text-[#e8a4b8] text-sm mt-0.5">LE {p.price}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-4 sticky top-28">
                        <div className="bg-[#2d1b2e] text-white rounded-[3rem] p-10 shadow-3xl shadow-purple-900/40 relative overflow-hidden">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl" />

                            <h2 className="text-2xl font-serif font-bold mb-10 border-b border-white/10 pb-6">Bag Summary</h2>

                            <div className="space-y-6 mb-10">
                                <div className="flex justify-between text-white/60 font-medium">
                                    <span>Items Subtotal</span>
                                    <span>LE {subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-white/60 font-medium">
                                    <span>Shipping Estimate</span>
                                    <span className="text-green-400 uppercase text-xs font-black tracking-widest">Complimentary</span>
                                </div>
                                <div className="h-px bg-white/10 my-6" />
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-white/40 text-xs font-black uppercase tracking-[0.2em] mb-1">Total</p>
                                        <p className="text-4xl font-black">LE {subtotal.toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>

                            <Link
                                href="/checkout"
                                className="w-full bg-white text-[#2d1b2e] h-16 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-[#e8a4b8] hover:text-white transition-all duration-500 shadow-xl"
                            >
                                SECURE CHECKOUT <ArrowRight className="w-5 h-5" />
                            </Link>

                            <div className="mt-8 flex items-center justify-center gap-4 text-white/30">
                                <Shield className="w-4 h-4" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Secured by Stripe Intelligence</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
