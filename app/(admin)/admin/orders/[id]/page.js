'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Package } from 'lucide-react'
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

    if (loading) return <div className="text-center py-12"><div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>
    if (!order) return <div className="text-center py-12 text-gray-500">Order not found</div>

    return (
        <div className="max-w-3xl">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-purple-600 mb-6 transition">
                <ArrowLeft className="w-4 h-4" /> Back
            </button>

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Order #{order.orderNumber}</h1>
                    <p className="text-gray-500 text-sm">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <span className={`text-sm px-3 py-1.5 rounded-full font-medium ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                        order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                            order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                                'bg-yellow-100 text-yellow-700'
                    }`}>{order.status}</span>
            </div>

            <div className="space-y-6">
                {/* Customer Info */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h2 className="text-lg font-semibold mb-4">Customer Information</h2>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><span className="text-gray-500">Name:</span> <span className="font-medium">{order.customerName}</span></div>
                        <div><span className="text-gray-500">Email:</span> <span className="font-medium">{order.customerEmail}</span></div>
                        <div><span className="text-gray-500">Phone:</span> <span className="font-medium">{order.customerPhone || 'N/A'}</span></div>
                        <div><span className="text-gray-500">Address:</span> <span className="font-medium">{order.shippingAddress || 'N/A'}</span></div>
                    </div>
                </div>

                {/* Items */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h2 className="text-lg font-semibold mb-4">Order Items</h2>
                    <div className="space-y-3">
                        {order.items?.map(item => (
                            <div key={item.id} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
                                <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                                    <img src={item.product?.image || '/placeholder.jpeg'} alt="" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">{item.product?.name}</p>
                                    <p className="text-xs text-gray-500">Qty: {item.quantity} × LE {item.price}</p>
                                </div>
                                <p className="text-sm font-semibold">LE {(item.quantity * item.price).toFixed(2)}</p>
                            </div>
                        ))}
                    </div>
                    <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-purple-600">LE {order.total}</span>
                    </div>
                </div>

                {/* Update Status */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h2 className="text-lg font-semibold mb-4">Update Shipping Status</h2>
                    <div className="flex gap-3">
                        <select value={status} onChange={e => setStatus(e.target.value)}
                            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-transparent">
                            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <button onClick={updateStatus} disabled={saving}
                            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-2.5 rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50">
                            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Update'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
