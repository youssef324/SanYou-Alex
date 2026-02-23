'use client'

import Link from 'next/link'
import { useEffect } from 'react'

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div style={{
      textAlign: 'center',
      padding: '100px 20px',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>Oops!</h1>
      <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Something went wrong</h2>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        {error.message || 'An unexpected error occurred'}
      </p>
      <button
        onClick={reset}
        style={{
          backgroundColor: '#db2777',
          color: 'white',
          padding: '12px 30px',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          marginRight: '10px'
        }}
      >
        Try Again
      </button>
      <Link href="/" style={{
        backgroundColor: '#4b5563',
        color: 'white',
        padding: '12px 30px',
        textDecoration: 'none',
        borderRadius: '8px',
        display: 'inline-block'
      }}>
        Go Home
      </Link>
    </div>
  )
}