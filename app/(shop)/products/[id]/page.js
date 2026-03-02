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
  const [selectedColor, setSelectedColor] = useState(null)
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
        if (data.colorVariants && data.colorVariants.length > 0) {
          setSelectedColor(data.colorVariants[0])
        }
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
        body: JSON.stringify({
          productId: parseInt(id),
          quantity,
          color: selectedColor?.color
        })
      })
      if (res.ok) {
        window.dispatchEvent(new Event('cart-updated'))
        router.push('/cart')
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
          <div className="aspect-[4/5] bg-gray-50 rounded-[2rem] animate-pulse" />
          <div className="space-y-6">
            <div className="h-4 bg-gray-50 rounded w-1/4 animate-pulse" />
            <div className="h-10 bg-gray-50 rounded w-3/4 animate-pulse" />
            <div className="h-6 bg-gray-50 rounded w-1/4 animate-pulse" />
            <div className="h-32 bg-gray-50 rounded w-full animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="pt-32 text-center py-20 px-4">
        <h2 className="text-3xl font-serif font-bold text-[#2d1b2e] mb-4">Product Not Found</h2>
        <p className="text-gray-500 mb-8">This item may have been moved or is no longer available.</p>
        <Link href="/" className="inline-flex items-center gap-2 bg-[#2d1b2e] text-white px-8 py-3 rounded-full font-bold">
          <ArrowLeft className="w-4 h-4" /> Go Back Home
        </Link>
      </div>
    )
  }

  // Handle images: if color selected, show its image set, otherwise show main images
  const baseImages = [product.image, ...(product.images || [])].filter(Boolean)
  const currentImages = selectedColor?.images && selectedColor.images.length > 0
    ? selectedColor.images
    : baseImages;

  const discountedPrice = product.discount > 0 ? (product.price * (1 - product.discount / 100)).toFixed(2) : product.price;

  return (
    <div className="pt-20 bg-[#fdf8f6]/30 min-h-screen">
      {/* Auth Alert Modal */}
      {showAuthAlert && (
        <div className="fixed inset-0 bg-[#2d1b2e]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAuthAlert(false)}>
          <div className="bg-white rounded-[2rem] p-10 max-w-sm w-full text-center shadow-2xl fade-up" onClick={e => e.stopPropagation()}>
            <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-10 h-10 text-purple-600" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-gray-900 mb-3">Welcome to SanYou</h3>
            <p className="text-gray-500 mb-8 leading-relaxed">Please sign in to your account to start curating your beauty collection.</p>
            <div className="flex flex-col gap-3">
              <Link href="/login" className="w-full py-4 bg-[#2d1b2e] text-white rounded-2xl font-bold hover:shadow-xl transition-all">
                Sign In
              </Link>
              <button onClick={() => setShowAuthAlert(false)} className="w-full py-4 text-gray-400 font-medium hover:text-gray-600 transition">
                Browse as Guest
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-400 hover:text-[#e8a4b8] transition-colors mb-10 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-bold uppercase tracking-widest">Return to Collection</span>
        </button>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Left: Image Gallery */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative aspect-[4/5] bg-white rounded-[2.5rem] overflow-hidden shadow-2xl shadow-purple-900/5 group border border-purple-100">
              <img
                src={currentImages[activeImage] || '/placeholder.jpeg'}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              {product.discount > 0 && (
                <div className="absolute top-8 left-8 bg-[#ef4444] text-white text-xs font-black px-4 py-2 rounded-full shadow-lg">
                  -{product.discount}% OFF
                </div>
              )}
            </div>

            {currentImages.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {currentImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all duration-300 ${activeImage === i
                      ? 'border-[#e8a4b8] scale-105 shadow-lg shadow-[#e8a4b8]/20'
                      : 'border-transparent opacity-60 hover:opacity-100 hover:scale-105'
                      }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <p className="text-xs font-bold text-[#e8a4b8] uppercase tracking-[0.2em]">{product.category?.name}</p>
                <button
                  onClick={toggleFavourite}
                  className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-300 ${isFav
                    ? 'border-pink-200 bg-pink-50 text-pink-500 shadow-lg shadow-pink-200/50 heart-pop'
                    : 'border-gray-100 text-gray-300 hover:border-pink-200 hover:bg-pink-50 hover:text-pink-400'
                    }`}
                >
                  <Heart className="w-6 h-6" fill={isFav ? 'currentColor' : 'none'} />
                </button>
              </div>

              <h1 className="text-4xl lg:text-5xl font-serif font-bold text-[#2d1b2e] leading-tight">{product.name}</h1>

              {product.brand && (
                <p className="text-gray-400 font-medium">From the house of <span className="text-[#c9a96e] font-bold">{product.brand}</span></p>
              )}

              <div className="flex items-end gap-4 py-2">
                <p className="text-4xl font-black text-gray-900">
                  LE {discountedPrice}
                </p>
                {product.discount > 0 && (
                  <p className="text-xl text-gray-300 line-through font-medium mb-1">
                    LE {product.price}
                  </p>
                )}
              </div>
            </div>

            {/* Color Variants */}
            {product.colorVariants && product.colorVariants.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Available Colors</h3>
                <div className="flex flex-wrap gap-4">
                  {product.colorVariants.map((v, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setSelectedColor(v);
                        setActiveImage(0);
                      }}
                      className={`group flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all duration-300 ${selectedColor?.color === v.color
                        ? 'border-[#2d1b2e] bg-[#2d1b2e] text-white shadow-lg'
                        : 'border-gray-100 bg-white hover:border-purple-200 text-gray-600'}`}
                    >
                      <div
                        className="w-5 h-5 rounded-full border border-black/5"
                        style={{ backgroundColor: v.hex }}
                      />
                      <span className="text-sm font-bold">{v.color}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Description Card */}
            <div className="bg-white p-8 rounded-[2rem] border border-purple-50 shadow-sm">
              <h3 className="text-xs font-black uppercase tracking-widest text-[#c9a96e] mb-4">The Selection</h3>
              <p className="text-gray-600 leading-loose text-sm">{product.description}</p>
            </div>

            {/* Ingredients Accordion-style */}
            {product.ingredients && (
              <div className="border-t border-purple-100 pt-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Key Ingredients</h3>
                <p className="text-gray-500 text-[13px] leading-relaxed italic">{product.ingredients}</p>
              </div>
            )}

            {/* Selection & Action */}
            <div className="space-y-6 pt-4">
              <div className="flex items-center justify-between bg-white p-2 border border-purple-100 rounded-[1.5rem] w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 flex items-center justify-center hover:bg-purple-50 rounded-2xl transition text-[#2d1b2e]"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-16 text-center font-black text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 flex items-center justify-center hover:bg-purple-50 rounded-2xl transition text-[#2d1b2e]"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={addToCart}
                  disabled={!product.inStock || addingToCart}
                  className="flex-1 bg-gradient-to-r from-[#2d1b2e] to-black text-white h-16 rounded-[1.5rem] font-bold shadow-2xl shadow-purple-900/20 hover:shadow-purple-700/30 transition-all duration-500 disabled:opacity-50 flex items-center justify-center gap-3 hover:-translate-y-1"
                >
                  <ShoppingBag className="w-5 h-5 text-[#e8a4b8]" />
                  {addingToCart ? 'PREPARING...' : 'ADD TO COLLECTION'}
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-6 pt-10 border-t border-purple-50">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-purple-50 text-[#c9a96e]">
                  <Truck className="w-5 h-5" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-tighter text-gray-400">Next Day Delivery</p>
              </div>
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-purple-50 text-[#c9a96e]">
                  <Shield className="w-5 h-5" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-tighter text-gray-400">Authenticity Guarantee</p>
              </div>
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-purple-50 text-[#c9a96e]">
                  <Package className="w-5 h-5" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-tighter text-gray-400">Eco Friendly Case</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}