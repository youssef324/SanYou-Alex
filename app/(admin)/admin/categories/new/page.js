'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Upload } from 'lucide-react'
import Link from 'next/link'

export default function NewCategoryPage() {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        image: ''
    })
    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch('/api/admin/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (res.ok) {
                router.push('/admin/categories')
                router.refresh()
            } else {
                const data = await res.json()
                alert(data.error || 'Failed to create category')
            }
        } catch (error) {
            alert('Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    // Auto-generate slug from name
    const handleNameChange = (e) => {
        const name = e.target.value
        setFormData({
            ...formData,
            name,
            slug: name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
        })
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/categories" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-3xl font-bold text-gray-900 font-serif">New Category</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] p-8 shadow-sm border border-purple-50 space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-sm font-black text-gray-400 uppercase tracking-widest">Category Name</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={handleNameChange}
                            className="w-full px-6 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-[#e8a4b8]/20 transition-all font-medium"
                            placeholder="e.g., Skincare"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-black text-gray-400 uppercase tracking-widest">Slug (URL)</label>
                        <input
                            type="text"
                            required
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            className="w-full px-6 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-[#e8a4b8]/20 transition-all font-medium"
                            placeholder="e.g., skincare"
                        />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                        <label className="text-sm font-black text-gray-400 uppercase tracking-widest">Description</label>
                        <textarea
                            rows={4}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-6 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-[#e8a4b8]/20 transition-all font-medium"
                            placeholder="Describe this category..."
                        />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                        <label className="text-sm font-black text-gray-400 uppercase tracking-widest">Image URL</label>
                        <div className="flex gap-4">
                            <input
                                type="text"
                                required
                                value={formData.image}
                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                className="flex-1 px-6 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-[#e8a4b8]/20 transition-all font-medium"
                                placeholder="/images/categories/skincare.jpg"
                            />
                        </div>
                        {formData.image && (
                            <div className="mt-4 w-32 h-32 rounded-2xl overflow-hidden border border-purple-50">
                                <img src={formData.image} className="w-full h-full object-cover" alt="Preview" />
                            </div>
                        )}
                    </div>
                </div>

                <div className="pt-4 flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 bg-[#2d1b2e] text-white px-10 py-4 rounded-full font-bold shadow-xl hover:bg-black transition-all active:scale-95 disabled:opacity-50"
                    >
                        <Save className="w-5 h-5" />
                        {loading ? 'Creating...' : 'Create Category'}
                    </button>
                </div>
            </form>
        </div>
    )
}
