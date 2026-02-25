'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Heart, ShoppingBag, Trash2, ArrowLeft } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function FavouritesPage() {
    const [favourites, setFavourites] = useState([])
    const [loading, setLoading] = useState(true)
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login')
            return
        }
        if (status === 'authenticated') {
            fetchFavourites()
        }
    }, [status])

    const fetchFavourites = async () => {
        try {
            const res = await fetch('/api/favourites')
            const data = await res.json()
            setFavourites(data.favourites || [])
        } catch (error) {
            console.error('Error:', error)
        } finally {
            setLoading(false)
        }
    }

    const removeFavourite = async (productId) => {
        try {
            await fetch('/api/favourites', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId })
            })
            setFavourites(prev => prev.filter(f => f.productId !== productId))
        } catch (error) {
            console.error('Error:', error)
        }
    }

    const addToCart = async (productId) => {
        try {
            const res = await fetch('/api/cart/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, quantity: 1 })
            })
            if (res.ok) {
                window.dispatchEvent(new Event('cart-updated'))
            }
        } catch (error) {
            console.error('Error:', error)
        }
    }

    if (loading) {
        return (
            <div className="pt-20 max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
                            <div className="aspect-square bg-gray-200" />
                            <div className="p-4 space-y-3">
                                <div className="h-4 bg-gray-200 rounded w-3/4" />
                                <div className="h-5 bg-gray-200 rounded w-1/3" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="pt-20 max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Favourites</h1>
                    <p className="text-gray-500 text-sm">{favourites.length} items</p>
                </div>
            </div>

            {favourites.length === 0 ? (
                <div className="text-center py-20">
                    <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No favourites yet</h3>
                    <p className="text-gray-500 mb-6">Start adding products you love!</p>
                    <Link href="/" className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
                        Browse Products
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {favourites.map((fav, index) => (
                        <div
                            key={fav.id}
                            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group fade-up"
                            style={{ animationDelay: `${index * 0.05}s` }}
                        >
                            <Link href={`/products/${fav.product.id}`}>
                                <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden relative">
                                    <img
                                        src={fav.product.image || '/placeholder.jpeg'}
                                        alt={fav.product.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <button
                                        onClick={(e) => { e.preventDefault(); removeFavourite(fav.productId) }}
                                        className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </Link>
                            <div className="p-4">
                                <p className="text-xs text-purple-500 font-medium mb-1">{fav.product.category?.name}</p>
                                <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">{fav.product.name}</h3>
                                <div className="flex items-center justify-between">
                                    <p className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                                        LE {fav.product.price}
                                    </p>
                                    <button
                                        onClick={() => addToCart(fav.productId)}
                                        className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                                    >
                                        <ShoppingBag className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
