'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function HomePage() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(setProducts)
  }, [])

  const addToCart = async (productId) => {
    try {
      const res = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: 1 })
      })

      if (res.ok) {
        alert('Added to cart!')
        window.dispatchEvent(new Event('cart-updated'))
      } else {
        alert('Failed to add to cart')
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert('Failed to add to cart')
    }
  }

  return (
    <div>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(to bottom right, #f5f0ff, #fff0f5)',
        padding: '60px 20px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span style={{
            background: 'rgba(255,255,255,0.5)',
            padding: '8px 20px',
            borderRadius: '50px',
            fontSize: '14px',
            color: '#9333ea'
          }}>
            New Collection 2026
          </span>
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginTop: '20px' }}>
            Glow Up with{' '}
            <span style={{ color: '#9333ea' }}>GLOW</span>
          </h1>
          <p style={{ fontSize: '18px', color: '#666', marginTop: '20px' }}>
            Discover premium beauty products crafted for your unique glow.
          </p>
          <div style={{ marginTop: '30px' }}>
            <Link href="/products">
              <button style={{
                background: '#9333ea',
                color: 'white',
                border: 'none',
                padding: '12px 30px',
                borderRadius: '50px',
                fontSize: '16px',
                marginRight: '10px',
                cursor: 'pointer'
              }}>
                Shop Now →
              </button>
            </Link>
            <button style={{
              border: '2px solid #9333ea',
              color: '#9333ea',
              background: 'transparent',
              padding: '10px 28px',
              borderRadius: '50px',
              fontSize: '16px',
              cursor: 'pointer'
            }}>
              Explore Skincare
            </button>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold' }}>Our Products</h2>
          <Link href="/products" style={{ color: '#9333ea' }}>View All →</Link>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '20px'
        }}>
          {products.map(product => (
            <div key={product.id} style={{
              border: '1px solid #eee',
              borderRadius: '12px',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '200px',
                background: '#f5f5f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                🖼️ {product.name}
              </div>
              <div style={{ padding: '15px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600' }}>{product.name}</h3>
                <p style={{ fontSize: '14px', color: '#666' }}>{product.category?.name}</p>
                <p style={{ fontSize: '20px', color: '#9333ea', fontWeight: 'bold' }}>
                  E {product.price}
                </p>
                <button 
                  onClick={() => addToCart(product.id)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: '#9333ea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    marginTop: '10px',
                    cursor: 'pointer'
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}