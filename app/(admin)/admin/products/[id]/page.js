'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save } from 'lucide-react'
import * as React from 'react'

export default function EditProductPage({ params }) {
    const { id } = React.use(params)
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState({
        name: '', description: '', price: '', brand: '', ingredients: '',
        image: '', categoryId: '', inventory: '0', inStock: true, isFeatured: false
    })
    const router = useRouter()

    useEffect(() => {
        Promise.all([
            fetch(`/api/admin/products/${id}`).then(r => r.json()),
            fetch('/api/categories').then(r => r.json())
        ]).then(([product, cats]) => {
            setFormData({
                name: product.name || '',
                description: product.description || '',
                price: String(product.price || ''),
                brand: product.brand || '',
                ingredients: product.ingredients || '',
                image: product.image || '',
                categoryId: String(product.categoryId || ''),
                inventory: String(product.inventory || 0),
                inStock: product.inStock ?? true,
                isFeatured: product.isFeatured ?? false
            })
            setCategories(cats)
            setLoading(false)
        })
    }, [id])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            const res = await fetch(`/api/admin/products/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price),
                    categoryId: parseInt(formData.categoryId),
                    inventory: parseInt(formData.inventory)
                })
            })
            if (res.ok) {
                router.push('/admin/products')
            } else {
                const data = await res.json()
                alert(data.error || 'Failed to update')
            }
        } catch (error) {
            alert('Failed to update')
        }
        setSaving(false)
    }

    if (loading) {
        return <div className="text-center py-12"><div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>
    }

    return (
        <div className="max-w-2xl">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-purple-600 mb-6 transition">
                <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Product</h1>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm space-y-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                    <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-transparent" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price (LE) *</label>
                        <input type="number" step="0.01" required value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-transparent" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                        <select required value={formData.categoryId} onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-transparent">
                            <option value="">Select category</option>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                    <input type="text" value={formData.brand} onChange={e => setFormData({ ...formData, brand: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-transparent" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                    <textarea required rows={3} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-transparent" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ingredients</label>
                    <textarea rows={2} value={formData.ingredients} onChange={e => setFormData({ ...formData, ingredients: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-transparent" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image URL *</label>
                    <input type="text" required value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-transparent" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Inventory</label>
                        <input type="number" value={formData.inventory} onChange={e => setFormData({ ...formData, inventory: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-transparent" />
                    </div>
                    <div className="flex items-end gap-6 pb-1">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={formData.inStock} onChange={e => setFormData({ ...formData, inStock: e.target.checked })}
                                className="w-4 h-4 text-purple-600 rounded" />
                            <span className="text-sm text-gray-700">In Stock</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={formData.isFeatured} onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })}
                                className="w-4 h-4 text-purple-600 rounded" />
                            <span className="text-sm text-gray-700">Featured</span>
                        </label>
                    </div>
                </div>

                <button type="submit" disabled={saving}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50">
                    <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </form>
        </div>
    )
}
