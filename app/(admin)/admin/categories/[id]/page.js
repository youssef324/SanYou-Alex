'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Trash2, Tag, Layers, Share2 } from 'lucide-react'
import * as React from 'react'

export default function EditCategoryPage({ params }) {
    const { id } = React.use(params)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState({ name: '', slug: '', description: '', image: '' })
    const router = useRouter()

    useEffect(() => {
        fetch(`/api/admin/categories/${id}`)
            .then(r => r.json())
            .then(data => {
                setFormData({
                    name: data.name || '',
                    slug: data.slug || '',
                    description: data.description || '',
                    image: data.image || ''
                })
                setLoading(false)
            })
    }, [id])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            const res = await fetch(`/api/admin/categories/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            if (res.ok) router.push('/admin/categories')
        } catch (error) {
            alert('Failed to update')
        } finally {
            setSaving(false)
        }
    }

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen -mt-20">
            <div className="w-12 h-12 border-4 border-[#e8a4b8] border-t-transparent rounded-full animate-spin" />
        </div>
    )

    return (
        <div className="max-w-4xl pb-20 px-4 pt-10 mx-auto">
            <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-6">
                    <button onClick={() => router.back()} className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl shadow-sm text-gray-400 hover:text-[#e8a4b8] transition-colors border border-purple-50 group">
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <h1 className="text-4xl font-serif font-bold text-[#2d1b2e]">Refine Category</h1>
                        <p className="text-[10px] font-black uppercase text-[#e8a4b8] tracking-widest mt-1">Evolving your beauty collection</p>
                    </div>
                </div>

                <div className="hidden md:flex gap-3">
                    <div className="px-6 py-3 bg-purple-50 rounded-2xl flex items-center gap-2 text-purple-600 text-xs font-bold border border-purple-100">
                        <Tag className="w-4 h-4" /> ID: {id}
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-10">
                <div className="lg:col-span-7">
                    <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-purple-50 space-y-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50/50 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-purple-100/50 transition-colors" />

                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                                <Layers className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-serif font-bold text-[#2d1b2e]">Core Configuration</h2>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-1">Visible Name *</label>
                                <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-6 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-purple-500/50 transition-all text-sm font-medium" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-1">Slug (URL identity)</label>
                                <input required type="text" value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                    className="w-full px-6 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-purple-500/50 transition-all text-sm font-medium" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-1">Description</label>
                                <textarea rows={5} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-6 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-purple-500/50 transition-all text-sm font-medium leading-relaxed italic" />
                            </div>
                        </div>

                        <button type="submit" disabled={saving}
                            className="w-full h-16 bg-[#2d1b2e] text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:shadow-purple-900/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            <Save className="w-5 h-5 text-[#e8a4b8]" /> {saving ? 'ENACTING CHANGES...' : 'SAVE REFINEMENTS'}
                        </button>
                    </form>
                </div>

                <div className="lg:col-span-5 space-y-10">
                    <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-purple-50 space-y-8">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                                <Share2 className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-serif font-bold text-[#2d1b2e]">Visual Identity</h2>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-1">Cover Image Source</label>
                            <input type="text" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })}
                                className="w-full px-6 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-purple-500/50 transition-all text-sm font-medium mb-6" />

                            <div className="w-full aspect-square bg-gray-50 rounded-[2rem] overflow-hidden shadow-inner border border-purple-50 group">
                                {formData.image ? (
                                    <img src={formData.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 italic p-10 text-center text-sm">
                                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4">
                                            <Tag className="w-6 h-6 text-gray-200" />
                                        </div>
                                        Provide a URL to preview your category cover here
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="p-8 bg-black/5 rounded-[2rem] border border-white space-y-4">
                        <h3 className="text-sm font-black text-[#2d1b2e] uppercase tracking-widest mb-4">Danger Zone</h3>
                        <p className="text-xs text-gray-500 leading-relaxed mb-4 italic">Deleting a category is permanent. You cannot delete categories that contain products.</p>
                        <button
                            type="button"
                            className="w-full py-4 bg-white border border-red-50 text-red-500 rounded-2xl text-xs font-black shadow-sm hover:bg-red-50 hover:border-red-100 transition-all flex items-center justify-center gap-2"
                        >
                            <Trash2 className="w-3.5 h-3.5" /> REMOVE CATEGORY PERMANENTLY
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
