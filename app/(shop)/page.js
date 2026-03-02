'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { ShoppingBag, Heart, Star, Sparkles, ArrowRight, Filter, Plus } from 'lucide-react'
import { useSession } from 'next-auth/react'

function HomeContent() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [hero, setHero] = useState({
    tagline: "SanYou is not just Make-up or Skincare - it's a feeling of elegance you can wear everyday",
    buttonText: "Shop Now",
    buttonLink: "/#products",
    image: null
  })
  const [activeCategory, setActiveCategory] = useState('all')
  const [loading, setLoading] = useState(true)
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const router = useRouter()
  const searchQuery = searchParams.get('search') || ''

  const fetchFavourites = async () => {
    try {
      const res = await fetch('/api/favourites')
      const data = await res.json()
      setWishlist(data.favourites || [])
    } catch (e) { console.error(e) }
  }

  useEffect(() => {
    Promise.all([
      fetch('/api/products').then(r => r.json()),
      fetch('/api/categories').then(r => r.json()),
      fetch('/api/hero').then(r => r.json()),
      fetch('/api/favourites').then(r => r.json())
    ]).then(([prods, cats, heroData, favs]) => {
      setProducts(prods)
      setCategories(cats)
      setWishlist(favs.favourites || [])
      if (heroData && !heroData.error) setHero(heroData)
      setLoading(false)
    })
  }, [])

  const toggleFavorite = async (e, productId) => {
    e.preventDefault()
    e.stopPropagation()
    if (!session) {
      router.push('/api/auth/signin')
      return
    }

    const isFav = wishlist.some(f => f.productId === productId)
    try {
      if (isFav) {
        setWishlist(wishlist.filter(f => f.productId !== productId))
        await fetch('/api/favourites', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId })
        })
      } else {
        const tempId = Date.now()
        setWishlist([...wishlist, { productId, id: tempId }])
        await fetch('/api/favourites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId })
        })
      }
    } catch (error) {
      console.error(error)
      fetchFavourites()
    }
  }

  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === 'all' || p.categoryId === parseInt(activeCategory)
    const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase())
    const inStock = p.inStock
    const isHidden = p.isHidden || false
    return matchesCategory && matchesSearch && inStock && !isHidden
  })

  const addToCart = async (e, productId) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      const res = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: 1 })
      })
      if (res.ok) {
        window.dispatchEvent(new Event('cart-updated'))
        const btn = e.target
        const originalText = btn.textContent
        btn.textContent = '✓ Added!'
        btn.classList.add('bg-green-500')
        setTimeout(() => {
          btn.textContent = originalText
          btn.classList.remove('bg-green-500')
        }, 1500)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-[#fdf8f6]">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#e8a4b8]/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#c9a96e]/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:py-32">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-[#e8a4b8] font-semibold border border-[#e8a4b8]/20 mb-6 fade-up">
                <Sparkles className="w-4 h-4" />
                Premium Beauty Experience
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold font-serif text-[#2d1b2e] leading-tight mb-6 fade-up">
                {hero.tagline.split('-')[0]}
                <span className="block mt-2 hero-text-gradient">
                  {hero.tagline.split('-')[1] || ''}
                </span>
              </h1>
              <p className="text-lg text-gray-600 mb-10 max-w-xl fade-up" style={{ animationDelay: '0.1s' }}>
                Discover elegance through our curated collection of luxury skincare and makeup essentials.
              </p>
              <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4 fade-up" style={{ animationDelay: '0.2s' }}>
                <Link href={hero.buttonLink || "/#products"} className="inline-flex items-center justify-center gap-2 bg-[#2d1b2e] text-white px-8 py-4 rounded-full font-bold shadow-xl hover:bg-black transition-all duration-300 hover:-translate-y-1">
                  {hero.buttonText} <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

            {hero.image && (
              <div className="flex-1 fade-up" style={{ animationDelay: '0.3s' }}>
                <div className="relative aspect-[4/5] max-w-sm mx-auto rounded-[2rem] overflow-hidden shadow-2xl rotate-2">
                  <img src={hero.image} alt="SanYou Beauty" className="w-full h-full object-cover" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Category Glowing Circles */}
      <div className="bg-white py-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-center text-sm font-bold uppercase tracking-widest text-gray-400 mb-8">Discover by Category</h3>
          <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide justify-start sm:justify-center">
            <button
              onClick={() => setActiveCategory('all')}
              className="flex flex-col items-center gap-3 group min-w-[80px]"
            >
              <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 transition-all duration-500 ${activeCategory === 'all' ? 'category-circle scale-110' : 'bg-gray-100 group-hover:bg-purple-100'}`}>
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-white shadow-inner">
                  <Sparkles className={`w-6 h-6 ${activeCategory === 'all' ? 'text-purple-600' : 'text-gray-400'}`} />
                </div>
              </div>
              <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-tighter transition-colors ${activeCategory === 'all' ? 'text-purple-600' : 'text-gray-500'}`}>All</span>
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(String(cat.id))}
                className="flex flex-col items-center gap-3 group min-w-[80px]"
              >
                <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 transition-all duration-500 ${activeCategory === String(cat.id) ? 'category-circle scale-110' : 'bg-gray-100 group-hover:scale-105'}`}>
                  <div className="w-full h-full rounded-full bg-white overflow-hidden border-2 border-white shadow-inner">
                    <img
                      src={cat.image || `https://api.dicebear.com/7.x/initials/svg?seed=${cat.name}`}
                      alt={cat.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-tighter transition-colors ${activeCategory === String(cat.id) ? 'text-purple-600' : 'text-gray-500'}`}>
                  {cat.name.replace('care', '')}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div id="products" className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">
              {searchQuery ? `Search: "${searchQuery}"` : activeCategory === 'all' ? 'Featured Collection' : categories.find(c => String(c.id) === activeCategory)?.name}
            </h2>
            <div className="h-1.5 w-20 bg-gradient-to-r from-[#e8a4b8] to-[#c9a96e] rounded-full" />
          </div>
          <p className="text-gray-500 text-sm font-medium">{filteredProducts.length} Premium Products</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-sm animate-pulse">
                <div className="aspect-[4/5] bg-gray-100" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                  <div className="h-6 bg-gray-100 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
            <Filter className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400">No items found matching your filter</h3>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
            {filteredProducts.map((product, index) => {
              const discountedPrice = product.discount > 0 ? (product.price * (1 - product.discount / 100)).toFixed(2) : product.price;

              return (
                <div
                  key={product.id}
                  className="group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 fade-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <Link href={`/products/${product.id}`}>
                    <div className="aspect-[4/5] bg-gray-50 overflow-hidden relative">
                      <img
                        src={product.image || '/placeholder.jpeg'}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                      />

                      <button
                        onClick={(e) => toggleFavorite(e, product.id)}
                        className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:bg-[#e8a4b8] hover:text-white transition-all duration-300 z-10"
                      >
                        <Heart className={`w-5 h-5 ${wishlist.some(f => f.productId === product.id) ? 'fill-current text-[#e8a4b8]' : 'text-gray-400 group-hover:text-white'}`} />
                      </button>

                      <div className="absolute top-4 left-4 flex flex-col gap-2">
                        {product.discount > 0 && (
                          <span className="discount-badge">-{product.discount}% OFF</span>
                        )}
                        {product.isFeatured && (
                          <div className="bg-white/90 backdrop-blur-sm text-[#c9a96e] text-[9px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                            <Star className="w-2.5 h-2.5" fill="#c9a96e" /> FEATURED
                          </div>
                        )}
                      </div>

                      {!product.inStock && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                          <span className="bg-gray-900 text-white text-[10px] font-bold px-4 py-2 rounded-full uppercase tracking-widest">Out of Stock</span>
                        </div>
                      )}

                      <div className="absolute bottom-4 left-4 right-4 translate-y-12 group-hover:translate-y-0 transition-transform duration-500 hidden sm:block">
                        <button
                          onClick={(e) => addToCart(e, product.id)}
                          disabled={!product.inStock}
                          className="w-full bg-white/95 backdrop-blur-sm text-gray-900 py-3 rounded-2xl font-bold text-xs shadow-xl hover:bg-gray-900 hover:text-white transition-all flex items-center justify-center gap-2"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" /> QUICK ADD
                        </button>
                      </div>
                    </div>
                  </Link>

                  <div className="p-5">
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-[10px] text-[#e8a4b8] font-bold uppercase tracking-widest">{product.category?.name}</p>
                      {product.brand && <p className="text-[10px] text-gray-400 font-medium">{product.brand}</p>}
                    </div>
                    <Link href={`/products/${product.id}`}>
                      <h3 className="font-bold text-gray-900 text-sm mb-3 line-clamp-2 min-h-[2.5rem] group-hover:text-[#e8a4b8] transition-colors">
                        {product.name}
                      </h3>
                    </Link>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        {product.discount > 0 && (
                          <span className="price-original">LE {product.price}</span>
                        )}
                        <span className="text-lg font-black text-gray-900">
                          LE {discountedPrice}
                        </span>
                      </div>

                      <button
                        onClick={(e) => addToCart(e, product.id)}
                        className="sm:hidden w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="pt-32 text-center">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500">Loading shop...</p>
      </div>
    }>
      <HomeContent />
    </Suspense>
  )
}