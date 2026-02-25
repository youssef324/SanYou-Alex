'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Heart, ShoppingBag, Minus, Plus, ArrowLeft, Package, Shield, Truck } from 'lucide-react'
import { useSession } from 'next-auth/react'
import * as React from 'react'

export default function ProductPage({ params }) {
  const { id } = React.use(params)
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [isFav, setIsFav] = useState(false)
  const [addingToCart, setAddingToCart] = useState(false)
  const [showAuthAlert, setShowAuthAlert] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data)
        setLoading(false)
      })
  }, [id])

  // Check if product is in favourites
  useEffect(() => {
    if (session && product) {
      fetch('/api/favourites')
        .then(r => r.json())
        .then(data => {
          const favIds = data.favourites?.map(f => f.productId) || []
          setIsFav(favIds.includes(product.id))
        })
        .catch(() => { })
    }
  }, [session, product])

  const addToCart = async () => {
    if (!session) {
      setShowAuthAlert(true)
      return
    }
    setAddingToCart(true)
    try {
      const res = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: parseInt(id), quantity })
      })
      if (res.ok) {
        window.dispatchEvent(new Event('cart-updated'))
        router.push('/')
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setAddingToCart(false)
    }
  }

  const toggleFavourite = async () => {
    if (!session) {
      setShowAuthAlert(true)
      return
    }
    try {
      if (isFav) {
        await fetch('/api/favourites', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: product.id })
        })
        setIsFav(false)
      } else {
        await fetch('/api/favourites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: product.id })
        })
        setIsFav(true)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  if (loading) {
    return (
      <div className="pt-20 max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="aspect-square bg-gray-200 rounded-2xl animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
            <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="pt-20 text-center py-20">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Product Not Found</h2>
        <Link href="/" className="text-purple-600 hover:underline">Go Back Home</Link>
      </div>
    )
  }

  const allImages = [product.image, ...(product.images || [])].filter(Boolean)

  return (
    <div className="pt-20">
      {/* Auth Alert Modal */}
      {showAuthAlert && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAuthAlert(false)}>
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Sign In Required</h3>
            <p className="text-gray-600 mb-6">Please sign in to continue shopping and manage your cart.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowAuthAlert(false)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition">
                Later
              </button>
              <Link href="/login" className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition text-center">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-purple-600 transition mb-6 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back</span>
        </button>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden">
              <img
                src={allImages[activeImage] || '/placeholder.jpeg'}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${activeImage === i ? 'border-purple-500 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium text-purple-500 mb-2">{product.category?.name}</p>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              {product.brand && (
                <p className="text-gray-500">by <span className="font-medium text-gray-700">{product.brand}</span></p>
              )}
            </div>

            <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              LE {product.price}
            </p>

            {/* Stock Status */}
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${product.inStock
                ? 'bg-green-50 text-green-700'
                : 'bg-red-50 text-red-700'
              }`}>
              <div className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`} />
              {product.inStock ? `In Stock (${product.inventory})` : 'Out of Stock'}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wider">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Ingredients */}
            {product.ingredients && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wider">Ingredients</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{product.ingredients}</p>
              </div>
            )}

            {/* Quantity + Actions */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">Quantity:</span>
                <div className="flex items-center bg-gray-100 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2.5 hover:bg-gray-200 transition"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2.5 hover:bg-gray-200 transition"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={addToCart}
                  disabled={!product.inStock || addingToCart}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 disabled:opacity-50 hover:-translate-y-0.5"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {addingToCart ? 'Adding...' : 'Add to Cart'}
                </button>
                <button
                  onClick={toggleFavourite}
                  className={`p-3.5 rounded-xl border-2 transition-all duration-300 ${isFav
                      ? 'border-pink-500 bg-pink-50 text-pink-500'
                      : 'border-gray-200 text-gray-400 hover:border-pink-300 hover:text-pink-400'
                    }`}
                >
                  <Heart className="w-5 h-5" fill={isFav ? 'currentColor' : 'none'} />
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100">
              <div className="text-center">
                <Truck className="w-5 h-5 text-purple-500 mx-auto mb-1" />
                <p className="text-xs text-gray-500">Free Shipping</p>
              </div>
              <div className="text-center">
                <Shield className="w-5 h-5 text-purple-500 mx-auto mb-1" />
                <p className="text-xs text-gray-500">Authentic</p>
              </div>
              <div className="text-center">
                <Package className="w-5 h-5 text-purple-500 mx-auto mb-1" />
                <p className="text-xs text-gray-500">Easy Returns</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}