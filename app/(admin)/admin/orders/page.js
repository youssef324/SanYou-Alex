'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Eye, Search } from 'lucide-react'

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    useEffect(() => {
        fetch('/api/admin/orders')
            .then(r => r.json())
            .then(data => { setOrders(data.orders || []); setLoading(false) })
    }, [])

    const filtered = orders.filter(o =>
        o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
        o.customerName.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
                <p className="text-gray-500 text-sm">{orders.length} total orders</p>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search orders..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500/50 focus:border-transparent" />
            </div>

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Order #</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Customer</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Total</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Date</th>
                                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? [...Array(5)].map((_, i) => (
                                <tr key={i}><td colSpan={6} className="px-6 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse" /></td></tr>
                            )) : filtered.length === 0 ? (
                                <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400">No orders found</td></tr>
                            ) : filtered.map(order => (
                                <tr key={order.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">#{order.orderNumber}</td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-gray-900">{order.customerName}</p>
                                        <p className="text-xs text-gray-500">{order.customerEmail}</p>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">LE {order.total}</td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                                                order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                                                    order.status === 'PROCESSING' ? 'bg-orange-100 text-orange-700' :
                                                        order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                                                            'bg-yellow-100 text-yellow-700'
                                            }`}>{order.status}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-right">
                                        <Link href={`/admin/orders/${order.id}`} className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition inline-flex">
                                            <Eye className="w-4 h-4" />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
