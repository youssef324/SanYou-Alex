'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Package, ArrowRight, ShoppingBag, Heart } from 'lucide-react'
import * as React from 'react'

export default function OrderSuccessPage() {
    const searchParams = useSearchParams()
    const id = searchParams.get('id')

    return (
        <div className="pt-32 pb-20 min-h-screen bg-[#fdf8f6]/30">
            <div className="max-w-3xl mx-auto px-4 text-center">
                <div className="bg-white rounded-[4rem] p-16 shadow-2xl shadow-purple-900/5 border border-purple-50 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-green-50 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-green-100 transition-colors" />

                    <div className="w-24 h-24 bg-green-500 text-white rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-xl shadow-green-500/30 animate-bounce">
                        <CheckCircle className="w-12 h-12" />
                    </div>

                    <h1 className="text-5xl font-serif font-bold text-[#2d1b2e] mb-4">Elegance Confirmed.</h1>
                    <p className="text-sm font-black uppercase text-[#e8a4b8] tracking-[0.2em] mb-10">SanYou Boutique Selection Complete</p>

                    <div className="inline-flex flex-col items-center gap-2 mb-12 p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 shadow-inner">
                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest leading-none">Your Reference ID</p>
                        <p className="text-2xl font-black text-[#2d1b2e] tracking-tight">{id || 'SY-' + Math.random().toString(36).substring(7).toUpperCase()}</p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 justify-center">
                        <Link
                            href="/account/profile"
                            className="px-10 py-5 bg-[#2d1b2e] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-3"
                        >
                            <Package className="w-5 h-5 text-[#e8a4b8]" /> View My Collections
                        </Link>
                        <Link
                            href="/"
                            className="px-10 py-5 bg-white text-[#2d1b2e] border border-purple-50 rounded-2xl font-black text-xs uppercase tracking-widest shadow-sm hover:bg-[#e8a4b8] hover:text-white hover:border-transparent transition-all flex items-center justify-center gap-3"
                        >
                            <ShoppingBag className="w-5 h-5" /> Continue My Tour
                        </Link>
                    </div>
                </div>

                <div className="mt-12 flex items-center justify-center gap-6 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                    <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Secure Payment</span>
                    <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Premium Handling</span>
                    <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Curated Beauty</span>
                </div>
            </div>
        </div>
    )
}
