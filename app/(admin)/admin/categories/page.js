'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Edit2, Trash2, Tag, Search, MoreVertical } from 'lucide-react'

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [showAddModal, setShowAddModal] = useState(false)
    const [newCategory, setNewCategory] = useState({ name: '', slug: '', description: '', image: '' })
    const [adding, setAdding] = useState(false)

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/admin/categories')
            const data = await res.json()
            setCategories(data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchCategories() }, [])

    const handleAdd = async (e) => {
        e.preventDefault()
        setAdding(true)
        try {
            const res = await fetch('/api/admin/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCategory)
            })
            if (res.ok) {
                setShowAddModal(false)
                setNewCategory({ name: '', slug: '', description: '', image: '' })
                fetchCategories()
            }
        } catch (error) {
            alert('Failed to add category')
        } finally {
            setAdding(false)
        }
    }

    const deleteCategory = async (id) => {
        if (!confirm('Are you sure?')) return
        try {
            const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' })
            const data = await res.json()
            if (res.ok) fetchCategories()
            else alert(data.error)
        } catch (error) {
            alert('Failed to delete')
        }
    }

    const filtered = categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
    )

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-gray-900">Manage Categories</h1>
                    <p className="text-sm text-gray-500 mt-1 uppercase tracking-widest font-black">Structuring your beauty boutique</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center justify-center gap-2 bg-[#2d1b2e] text-white px-8 py-3.5 rounded-[1.2rem] font-bold shadow-xl hover:bg-black transition-all"
                >
                    <Plus className="w-5 h-5 text-[#e8a4b8]" /> Add New Category
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-3 rounded-[1.5rem] border border-purple-50 shadow-sm transition-all focus-within:shadow-md">
                <div className="relative flex-1 group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-[#e8a4b8] transition-colors" />
                    <input
                        type="text"
                        placeholder="Search categories..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-16 pr-6 py-4 border-0 bg-transparent rounded-2xl focus:ring-0 text-sm font-medium"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((cat, i) => (
                    <div key={cat.id} className="bg-white rounded-[2rem] p-8 border border-purple-50 shadow-sm hover:shadow-2xl hover:shadow-purple-900/5 transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVertical className="w-5 h-5 text-gray-300" />
                        </div>

                        <div className="flex items-start gap-6 mb-8">
                            <div className="w-16 h-16 bg-purple-50 rounded-2xl overflow-hidden shadow-inner flex-shrink-0">
                                <img src={cat.image || '/placeholder.jpeg'} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            </div>
                            <div className="min-w-0">
                                <h3 className="text-xl font-bold text-[#2d1b2e] mb-1 truncate">{cat.name}</h3>
                                <p className="text-[10px] font-black uppercase text-[#e8a4b8] tracking-widest mb-1">{cat.slug}</p>
                                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                    <Tag className="w-3.5 h-3.5" /> {cat._count?.products || 0} Products
                                </div>
                            </div>
                        </div>

                        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-8 h-10 italic">
                            {cat.description || 'No description provided.'}
                        </p>

                        <div className="flex gap-3">
                            <Link
                                href={`/admin/categories/${cat.id}`}
                                className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-gray-50 text-gray-700 rounded-2xl font-bold text-xs hover:bg-purple-50 hover:text-purple-600 transition"
                            >
                                <Edit2 className="w-3.5 h-3.5" /> Edit
                            </Link>
                            <button
                                onClick={() => deleteCategory(cat.id)}
                                className="flex items-center justify-center w-12 h-12 bg-gray-50 text-gray-300 rounded-2xl hover:bg-red-50 hover:text-red-500 transition"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-[#2d1b2e]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2.5rem] p-10 max-w-lg w-full shadow-2xl fade-up border border-purple-100">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h2 className="text-3xl font-serif font-bold text-gray-900">Define Category</h2>
                                <p className="text-[10px] font-black uppercase text-[#e8a4b8] tracking-widest mt-1">Expanding the boutique range</p>
                            </div>
                            <button onClick={() => setShowAddModal(false)} className="w-12 h-12 flex items-center justify-center text-gray-300 hover:text-gray-900 hover:bg-gray-50 rounded-full transition">
                                <MoreVertical className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleAdd} className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-1">Category Name</label>
                                <input required type="text" value={newCategory.name} onChange={e => setNewCategory({ ...newCategory, name: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-') })}
                                    placeholder="e.g. Skin Care"
                                    className="w-full px-6 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-purple-500/50 transition-all text-sm font-medium" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-1">Slug (URL identifier)</label>
                                <input required type="text" value={newCategory.slug} onChange={e => setNewCategory({ ...newCategory, slug: e.target.value })}
                                    placeholder="e.g. skin-care"
                                    className="w-full px-6 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-purple-500/50 transition-all text-sm font-medium" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-1">Image URL</label>
                                <input type="text" value={newCategory.image} onChange={e => setNewCategory({ ...newCategory, image: e.target.value })}
                                    placeholder="https://images.unsplash.com/..."
                                    className="w-full px-6 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-purple-500/50 transition-all text-sm font-medium" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-1">Brief Description</label>
                                <textarea rows={3} value={newCategory.description} onChange={e => setNewCategory({ ...newCategory, description: e.target.value })}
                                    placeholder="Tell the story of this category..."
                                    className="w-full px-6 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-purple-500/50 transition-all text-sm font-medium" />
                            </div>
                            <button type="submit" disabled={adding}
                                className="w-full h-16 bg-[#2d1b2e] text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:shadow-purple-900/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                <Plus className="w-5 h-5 text-[#e8a4b8]" /> {adding ? 'MANIFESTING...' : 'CREATE CATEGORY'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
