import { prisma } from '@/lib/prisma-server'

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: { products: true }
    })
    
    return new Response(JSON.stringify(categories), {
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