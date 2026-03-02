'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Package, User, MapPin, CreditCard, ShoppingBag, Clock } from 'lucide-react'
import * as React from 'react'

const STATUSES = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']

export default function OrderDetailPage({ params }) {
    const { id } = React.use(params)
    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)
    const [status, setStatus] = useState('')
    const [saving, setSaving] = useState(false)
    const router = useRouter()

    useEffect(() => {
        fetch(`/api/admin/orders/${id}`)
            .then(r => r.json())
            .then(data => {
                setOrder(data.order)
                setStatus(data.order?.status || '')
                setLoading(false)
            })
    }, [id])

    const updateStatus = async () => {
        setSaving(true)
        try {
            await fetch(`/api/admin/orders/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            })
            setOrder(prev => ({ ...prev, status }))
        } catch (error) {
            alert('Failed to update')
        }
        setSaving(false)
    }

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="w-12 h-12 border-4 border-[#e8a4b8] border-t-transparent rounded-full animate-spin" />
        </div>
    )

    if (!order) return <div className="text-center py-20 text-gray-400 font-serif italic">Order not found in our records.</div>

    return (
        <div className="max-w-5xl pb-20 px-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div className="flex items-center gap-6">
                    <button onClick={() => router.back()} className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl shadow-sm text-gray-400 hover:text-[#e8a4b8] transition-colors border border-purple-50">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-[#2d1b2e]">Order Archive</h1>
                        <p className="text-[10px] font-black uppercase text-[#e8a4b8] tracking-widest mt-1">Ref ID: {order.orderNumber}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <span className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${order.status === 'DELIVERED' ? 'bg-green-50 text-green-600 border border-green-100' :
                        order.status === 'CANCELLED' ? 'bg-red-50 text-red-600 border border-red-100' :
                            'bg-purple-50 text-purple-600 border border-purple-100'
                        }`}>
                        {order.status}
                    </span>
                </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-8">
                    {/* Items Section */}
                    <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-purple-50 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 text-purple-50/20">
                            <ShoppingBag className="w-24 h-24" />
                        </div>

                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                                <Package className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-serif font-bold text-[#2d1b2e]">Collection Details</h2>
                        </div>

                        <div className="space-y-6">
                            {order.items?.map(item => (
                                <div key={item.id} className="flex items-center gap-6 py-4 border-b border-purple-50 last:border-0 group">
                                    <div className="w-20 h-20 bg-gray-50 rounded-[1.2rem] overflow-hidden shadow-inner flex-shrink-0 group-hover:scale-105 transition-transform duration-500">
                                        <img src={item.product?.image || '/placeholder.jpeg'} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-base font-bold text-[#2d1b2e] truncate">{item.product?.name}</h3>
                                        <div className="flex items-center gap-4 mt-2">
                                            <p className="text-xs text-gray-500 font-medium">Qty: <span className="text-[#2d1b2e]">{item.quantity}</span></p>
                                            {item.color && (
                                                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 rounded-full border border-gray-100">
                                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                                                    <span className="text-[10px] font-black uppercase text-gray-400">{item.color}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-400 font-medium mb-1 line-through opacity-0">LE 00</p>
                                        <p className="text-lg font-black text-[#2d1b2e]">LE {item.price.toFixed(0)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-10 pt-10 border-t border-purple-50 flex flex-col items-end gap-2">
                            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Final Order Value</p>
                            <p className="text-5xl font-black text-[#2d1b2e]">LE {order.total.toFixed(0)}</p>
                        </div>
                    </div>

                    {/* Status Update */}
                    <div className="bg-[#2d1b2e] text-white rounded-[2.5rem] p-10 shadow-xl shadow-purple-900/10">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-[#e8a4b8]">
                                <Clock className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-serif font-bold">Logistics Status</h2>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <select
                                    value={status}
                                    onChange={e => setStatus(e.target.value)}
                                    className="w-full px-8 py-5 bg-white/10 border-0 rounded-2xl focus:ring-2 focus:ring-[#e8a4b8]/50 transition-all text-sm font-bold appearance-none"
                                >
                                    {STATUSES.map(s => <option key={s} value={s} className="text-gray-900">{s}</option>)}
                                </select>
                            </div>
                            <button
                                onClick={updateStatus}
                                disabled={saving}
                                className="px-10 py-5 bg-[#e8a4b8] text-white rounded-2xl font-black hover:bg-white hover:text-[#2d1b2e] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                <Save className="w-5 h-5" /> {saving ? 'SYNCING...' : 'UPDATE ORDER STATUS'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-8">
                    {/* Customer Profile */}
                    <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-purple-50 space-y-8">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                                <User className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-serif font-bold text-[#2d1b2e]">Recipient</h2>
                        </div>

                        <div className="space-y-6">
                            <div className="group">
                                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1 ml-1 group-hover:text-[#e8a4b8] transition-colors">Full Identity</p>
                                <p className="text-lg font-bold text-[#2d1b2e]">{order.customerName}</p>
                            </div>
                            <div className="group">
                                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1 ml-1 group-hover:text-[#e8a4b8] transition-colors">Digital Contact</p>
                                <p className="text-sm font-medium text-gray-600">{order.customerEmail}</p>
                            </div>
                            <div className="group">
                                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1 ml-1 group-hover:text-[#e8a4b8] transition-colors">Mobile Number</p>
                                <p className="text-sm font-medium text-gray-600">{order.customerPhone || 'Not provided'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Destination */}
                    <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-purple-50 space-y-8">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-serif font-bold text-[#2d1b2e]">Destination</h2>
                        </div>

                        <div>
                            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4 ml-1">Shipping Address</p>
                            <div className="p-6 bg-gray-50 rounded-2xl italic text-sm text-gray-500 leading-relaxed border border-gray-100">
                                {order.shippingAddress || 'Digital Product / Pickup'}
                            </div>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-purple-50 space-y-8">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                                <CreditCard className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-serif font-bold text-[#2d1b2e]">Financials</h2>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Method</p>
                                <p className="text-sm font-bold text-[#2d1b2e]">{order.paymentMethod === 'CARD' ? 'Visa / Credit Card' : 'Cash on Delivery'}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Payment</p>
                                <p className={`text-[10px] font-black uppercase px-3 py-1 rounded-lg ${order.paymentStatus === 'PAID' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                                    {order.paymentStatus}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
