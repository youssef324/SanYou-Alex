export default function ProductSkeleton() {
  return (
    <div style={{
      border: '1px solid #eaeaea',
      borderRadius: '8px',
      padding: '15px',
      backgroundColor: 'white'
    }}>
      <div style={{
        width: '100%',
        height: '200px',
        backgroundColor: '#f0f0f0',
        borderRadius: '4px',
        marginBottom: '15px',
        animation: 'pulse 1.5s infinite'
      }} />
      <div style={{
        height: '20px',
        width: '80%',
        backgroundColor: '#f0f0f0',
        marginBottom: '10px',
        animation: 'pulse 1.5s infinite'
      }} />
      <div style={{
        height: '16px',
        width: '40%',
        backgroundColor: '#f0f0f0',
        animation: 'pulse 1.5s infinite'
      }} />
    </div>
  )
}