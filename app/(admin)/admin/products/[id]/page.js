'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Plus } from 'lucide-react'
import * as React from 'react'

export default function EditProductPage({ params }) {
    const { id } = React.use(params)
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState({
        name: '', description: '', price: '', discount: '0', brand: '', ingredients: '',
        image: '', images: '', colorVariants: '[]', categoryId: '', inventory: '0',
        inStock: true, isFeatured: false, isHidden: false
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
                discount: String(product.discount || '0'),
                brand: product.brand || '',
                ingredients: product.ingredients || '',
                image: product.image || '',
                images: Array.isArray(product.images) ? product.images.join(', ') : '',
                colorVariants: product.colorVariants ? JSON.stringify(product.colorVariants, null, 2) : '[]',
                categoryId: String(product.categoryId || ''),
                inventory: String(product.inventory || 0),
                inStock: product.inStock ?? true,
                isFeatured: product.isFeatured ?? false,
                isHidden: product.isHidden ?? false
            })
            setCategories(cats)
            setLoading(false)
        })
    }, [id])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            let colorVars = [];
            try {
                colorVars = JSON.parse(formData.colorVariants);
            } catch (e) {
                alert('Invalid JSON in Color Variants');
                setSaving(false);
                return;
            }

            const res = await fetch(`/api/admin/products/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price),
                    discount: parseFloat(formData.discount),
                    categoryId: parseInt(formData.categoryId),
                    inventory: parseInt(formData.inventory),
                    images: formData.images.split(',').map(s => s.trim()).filter(Boolean),
                    colorVariants: colorVars
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
        <div className="max-w-3xl pb-20 px-4 pt-10">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-purple-600 mb-6 transition">
                <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <h1 className="text-2xl font-bold text-gray-900 mb-6 font-serif">Edit Premium Product</h1>

            <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] p-8 shadow-sm border border-purple-50 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-1">Product Name *</label>
                        <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-6 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-purple-500/50 transition-all text-sm font-medium" />
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-1">Price (LE) *</label>
                        <input type="number" step="0.01" required value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })}
                            className="w-full px-6 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-purple-500/50 transition-all text-sm font-medium" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-1">Discount %</label>
                        <input type="number" step="1" value={formData.discount} onChange={e => setFormData({ ...formData, discount: e.target.value })}
                            className="w-full px-6 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-purple-500/50 transition-all text-sm font-medium" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-1">Category *</label>
                        <select required value={formData.categoryId} onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                            className="w-full px-6 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-purple-500/50 transition-all text-sm font-medium appearance-none">
                            <option value="">Select category</option>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-1">Brand</label>
                        <input type="text" value={formData.brand} onChange={e => setFormData({ ...formData, brand: e.target.value })}
                            className="w-full px-6 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-purple-500/50 transition-all text-sm font-medium" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-1">Inventory</label>
                        <input type="number" value={formData.inventory} onChange={e => setFormData({ ...formData, inventory: e.target.value })}
                            className="w-full px-6 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-purple-500/50 transition-all text-sm font-medium" />
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-1">Description *</label>
                    <textarea required rows={4} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-6 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-purple-500/50 transition-all text-sm font-medium" />
                </div>

                <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-1">Ingredients</label>
                    <textarea rows={2} value={formData.ingredients} onChange={e => setFormData({ ...formData, ingredients: e.target.value })}
                        className="w-full px-6 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-purple-500/50 transition-all text-sm font-medium" />
                </div>

                <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-1">Main Image URL *</label>
                    <input type="text" required value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })}
                        className="w-full px-6 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-purple-500/50 transition-all text-sm font-medium" />
                </div>

                <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-1">Additional Images (comma separated URLs)</label>
                    <textarea rows={2} value={formData.images} onChange={e => setFormData({ ...formData, images: e.target.value })}
                        className="w-full px-6 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-purple-500/50 transition-all text-sm font-medium" />
                </div>

                <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-1">Color Variants (JSON)</label>
                    <p className="text-[10px] text-gray-400 mb-2 italic">Format: [{`{"color": "Red", "hex": "#FF0000", "images": ["url1", "url2"]}`}]</p>
                    <textarea rows={5} value={formData.colorVariants} onChange={e => setFormData({ ...formData, colorVariants: e.target.value })}
                        className="w-full px-6 py-4 bg-gray-50 border-0 rounded-2xl font-mono text-xs focus:ring-2 focus:ring-purple-500/50 transition-all" />
                </div>

                <div className="flex flex-wrap items-center gap-x-10 gap-y-4 py-4 px-2">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${formData.inStock ? 'bg-green-500 border-green-500' : 'border-gray-200 group-hover:border-green-200'}`}>
                            {formData.inStock && <Plus className="w-4 h-4 text-white rotate-45" />}
                        </div>
                        <input type="checkbox" checked={formData.inStock} onChange={e => setFormData({ ...formData, inStock: e.target.checked })} className="hidden" />
                        <span className="text-sm font-bold text-gray-700">In Stock</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${formData.isFeatured ? 'bg-purple-500 border-purple-500' : 'border-gray-200 group-hover:border-purple-200'}`}>
                            {formData.isFeatured && <Plus className="w-4 h-4 text-white rotate-45" />}
                        </div>
                        <input type="checkbox" checked={formData.isFeatured} onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })} className="hidden" />
                        <span className="text-sm font-bold text-gray-700">Featured</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${formData.isHidden ? 'bg-red-500 border-red-500' : 'border-gray-200 group-hover:border-red-200'}`}>
                            {formData.isHidden && <Plus className="w-4 h-4 text-white rotate-45" />}
                        </div>
                        <input type="checkbox" checked={formData.isHidden} onChange={e => setFormData({ ...formData, isHidden: e.target.checked })} className="hidden" />
                        <span className="text-sm font-bold text-red-600">Hidden from Shop</span>
                    </label>
                </div>

                <button type="submit" disabled={saving}
                    className="w-full h-16 bg-[#2d1b2e] text-white rounded-2xl font-bold hover:shadow-2xl hover:shadow-purple-900/20 transition-all disabled:opacity-50 flex items-center justify-center gap-3">
                    <Save className="w-5 h-5 text-[#e8a4b8]" /> {saving ? 'SAVING CHANGES...' : 'SAVE PRODUCT DETAILS'}
                </button>
            </form>
        </div>
    )
}
