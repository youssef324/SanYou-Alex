import { prisma } from '@/lib/prisma-server'

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: { category: true }
    })
    
    return new Response(JSON.stringify(products), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (error) {
    console.error('API Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}