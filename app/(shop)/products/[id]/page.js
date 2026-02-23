'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import * as React from 'react'

export default function ProductPage({ params }) {
  const { id } = React.use(params)
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data)
        setLoading(false)
      })
  }, [id])

  const addToCart = async () => {
    await fetch('/api/cart/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: id, quantity })
    })
    alert('Added to cart!')
  }

  if (loading) return <div className="pt-20 text-center">Loading...</div>

  return (
    <div className="pt-20">
      <div className="modern-container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-gray-600">{product.category?.name}</p>
        </div>

        {/* Products Grid - 2 columns on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {product.map(product => (
            <Link 
              key={product.id}
              href={`/products/${product.id}`}
              className="group"
            >
              <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
                {/* Image Container - Fixed aspect ratio */}
                <div className="aspect-square bg-gray-100 overflow-hidden">
                  <img 
                    src={product.image || '/placeholder.jpeg'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                
                {/* Product Info */}
                <div className="p-3">
                  <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2">{product.category?.name}</p>
                  <p className="text-base font-semibold text-purple-600 mb-3">
                    LE {product.price}
                  </p>
                  <button className="w-full bg-purple-600 text-white text-sm py-2 rounded-lg hover:bg-purple-700 transition">
                    Add to Cart
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}