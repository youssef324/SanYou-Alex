import { prisma } from '@/lib/prisma-server'

export async function GET(request, { params }) {
  try {
    const { id } = await params
    
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: { category: true }
    })
    
    if (!product) {
      return new Response(JSON.stringify({ error: 'Product not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    return new Response(JSON.stringify(product), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}