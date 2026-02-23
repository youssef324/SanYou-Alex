import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{
      textAlign: 'center',
      padding: '100px 20px',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <h1 style={{ fontSize: '72px', marginBottom: '20px' }}>404</h1>
      <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Page Not Found</h2>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link href="/" style={{
        backgroundColor: '#db2777',
        color: 'white',
        padding: '12px 30px',
        textDecoration: 'none',
        borderRadius: '8px',
        display: 'inline-block'
      }}>
        Go Back Home
      </Link>
    </div>
  )
}