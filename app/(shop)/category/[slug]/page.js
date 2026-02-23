import { fetchCategory } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'

export default async function CategoryPage({ params }) {
  const { slug } = await params
  
  let category
  try {
    category = await fetchCategory(slug)
  } catch (error) {
    console.error('Error fetching category:', error)
    return <div>Error loading category</div>
  }

  if (!category) {
    return <div>Category not found</div>
  }

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '40px auto',
      padding: '0 16px'
    }}>
      <Link href="/products" style={{
        color: '#666',
        textDecoration: 'none',
        display: 'inline-block',
        marginBottom: '20px',
        fontSize: '14px'
      }}>
        ← Back to Products
      </Link>
      
      <h1 style={{
        fontSize: 'clamp(24px, 5vw, 32px)',
        fontWeight: 'bold',
        marginBottom: '10px',
        color: '#1f2937'
      }}>
        {category.name}
      </h1>
      
      <p style={{
        color: '#6b7280',
        marginBottom: '30px',
        fontSize: '14px'
      }}>
        {category.products?.length || 0} products
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '16px'
      }}>
        {category.products?.map(product => (
          <Link 
            href={`/products/${product.id}`} 
            key={product.id}
            style={{
              textDecoration: 'none',
              color: 'inherit',
              backgroundColor: 'white',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}
          >
            <div style={{
              position: 'relative',
              width: '100%',
              paddingBottom: '100%',
              backgroundColor: '#f9fafb'
            }}>
              <img 
                src={product.image || '/placeholder.jpg'}
                alt={product.name}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>
            
            <div style={{ padding: '12px' }}>
              <h3 style={{
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '4px',
                color: '#1f2937',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {product.name}
              </h3>
              
              <p style={{
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#db2777'
              }}>
                LE {product.price}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}