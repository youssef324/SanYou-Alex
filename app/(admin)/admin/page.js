'use client'

import { useState, useEffect } from 'react'
import { Package, ShoppingCart, Users, DollarSign, TrendingUp, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboard() {
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/admin/stats')
            .then(r => r.json())
            .then(data => {
                setStats(data)
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [])

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl p-6 shadow-sm animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
                            <div className="h-8 bg-gray-200 rounded w-1/3" />
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    const statCards = [
        { label: 'Total Products', value: stats?.totalProducts || 0, icon: Package, color: 'stat-card-purple', iconBg: 'bg-purple-100', iconColor: 'text-purple-600' },
        { label: 'Total Orders', value: stats?.totalOrders || 0, icon: ShoppingCart, color: 'stat-card-pink', iconBg: 'bg-pink-100', iconColor: 'text-pink-600' },
        { label: 'Total Revenue', value: `LE ${(stats?.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, color: 'stat-card-green', iconBg: 'bg-green-100', iconColor: 'text-green-600' },
        { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'stat-card-blue', iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
    ]

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500 text-sm mt-1">Welcome back! Here&apos;s your store overview.</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, i) => {
                    const Icon = card.icon
                    return (
                        <div key={i} className={`bg-white rounded-2xl p-6 shadow-sm ${card.color} hover:shadow-md transition-all duration-300 fade-up`} style={{ animationDelay: `${i * 0.1}s` }}>
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-medium text-gray-500">{card.label}</span>
                                <div className={`w-10 h-10 ${card.iconBg} rounded-xl flex items-center justify-center`}>
                                    <Icon className={`w-5 h-5 ${card.iconColor}`} />
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                        </div>
                    )
                })}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-purple-50">
                <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-purple-500" /> Quick Actions
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <Link href="/admin/products/new" className="flex items-center justify-center gap-3 p-4 bg-purple-50 text-purple-700 rounded-2xl font-bold hover:bg-purple-100 transition-all border border-purple-100/50 group">
                        <Package className="w-5 h-5 group-hover:scale-110 transition-transform" /> Add Product
                    </Link>
                    <Link href="/admin/categories" className="flex items-center justify-center gap-3 p-4 bg-pink-50 text-pink-700 rounded-2xl font-bold hover:bg-pink-100 transition-all border border-pink-100/50 group">
                        <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" /> Manage Categories
                    </Link>
                    <Link href="/admin/orders" className="flex items-center justify-center gap-3 p-4 bg-blue-50 text-blue-700 rounded-2xl font-bold hover:bg-blue-100 transition-all border border-blue-100/50 group">
                        <TrendingUp className="w-5 h-5 group-hover:scale-110 transition-transform" /> View Orders
                    </Link>
                    <Link href="/" className="flex items-center justify-center gap-3 p-4 bg-gray-50 text-gray-700 rounded-2xl font-bold hover:bg-gray-100 transition-all border border-gray-100/50 group">
                        <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" /> Visit Store
                    </Link>
                </div>
            </div>

            {/* Top Products & Recent Orders */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Products */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-900">Top Products</h2>
                        <TrendingUp className="w-5 h-5 text-purple-500" />
                    </div>
                    <div className="space-y-4">
                        {stats?.topProducts?.length > 0 ? stats.topProducts.map((prod, i) => (
                            <div key={prod.id} className="flex items-center gap-4">
                                <span className="text-sm font-bold text-gray-400 w-6">{i + 1}</span>
                                <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                    <img src={prod.image || '/placeholder.jpeg'} alt="" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">{prod.name}</p>
                                    <p className="text-xs text-gray-500">{prod._count?.orderItems || 0} orders</p>
                                </div>
                                <p className="text-sm font-semibold text-purple-600">LE {prod.price}</p>
                            </div>
                        )) : (
                            <p className="text-gray-400 text-sm">No products yet</p>
                        )}
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
                        <ArrowUpRight className="w-5 h-5 text-purple-500" />
                    </div>
                    <div className="space-y-4">
                        {stats?.recentOrders?.length > 0 ? stats.recentOrders.map(order => (
                            <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">#{order.orderNumber}</p>
                                    <p className="text-xs text-gray-500">{order.customerName}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-gray-900">LE {order.total}</p>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                                        order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                                            order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-gray-100 text-gray-700'
                                        }`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        )) : (
                            <p className="text-gray-400 text-sm">No orders yet</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
