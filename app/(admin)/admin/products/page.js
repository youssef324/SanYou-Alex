'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Edit, Trash2, Search } from 'lucide-react'

export default function AdminProductsPage() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [deleting, setDeleting] = useState(null)

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        const res = await fetch('/api/admin/products')
        const data = await res.json()
        setProducts(data.products || [])
        setLoading(false)
    }

    const deleteProduct = async (id) => {
        if (!confirm('Are you sure you want to delete this product?')) return
        setDeleting(id)
        try {
            await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
            setProducts(prev => prev.filter(p => p.id !== id))
        } catch (error) {
            alert('Failed to delete product')
        }
        setDeleting(null)
    }

    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                    <p className="text-gray-500 text-sm">{products.length} products</p>
                </div>
                <Link href="/admin/products/new" className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-4 py-2.5 rounded-xl font-medium hover:shadow-lg transition-all">
                    <Plus className="w-4 h-4" /> Add Product
                </Link>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500/50 focus:border-transparent"
                />
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Product</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Category</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Price</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Stock</th>
                                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i}>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse w-32" /></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse w-20" /></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse w-16" /></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse w-12" /></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse w-20 ml-auto" /></td>
                                    </tr>
                                ))
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">No products found</td></tr>
                            ) : filtered.map(product => (
                                <tr key={product.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                <img src={product.image || '/placeholder.jpeg'} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{product.name}</p>
                                                <p className="text-xs text-gray-500">{product.brand || 'No brand'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{product.category?.name}</td>
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">LE {product.price}</td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {product.inStock ? `${product.inventory} in stock` : 'Out of stock'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={`/admin/products/${product.id}`} className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition">
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => deleteProduct(product.id)}
                                                disabled={deleting === product.id}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
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
