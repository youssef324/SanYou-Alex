import { prisma } from '@/lib/prisma-server'

export async function GET(request, { params }) {
  try {
    const { slug } = await params
    
    const category = await prisma.category.findUnique({
      where: { slug: slug },
      include: { products: true }
    })
    
    if (!category) {
      return new Response(JSON.stringify({ error: 'Category not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    return new Response(JSON.stringify(category), {
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