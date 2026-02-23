import { prisma } from '@/lib/prisma-server'
import { cookies } from 'next/headers'

export async function POST(request) {
  try {
    const { cartItemId } = await request.json()
    
    await prisma.cartItem.delete({
      where: { id: parseInt(cartItemId) }
    })

    return Response.json({ success: true })

  } catch (error) {
    console.error('Remove error:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}