import { prisma } from '@/lib/prisma-server'
import { cookies } from 'next/headers'
import { auth } from '@/lib/auth'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request) {
  try {
    const { productId, quantity = 1 } = await request.json()
    if (!productId) {
      return Response.json({ error: 'Product ID is required' }, { status: 400 })
    }

    const session = await auth()
    const cookieStore = await cookies()
    let sessionId = cookieStore.get('sessionId')?.value

    if (!sessionId) {
      sessionId = uuidv4()
      cookieStore.set('sessionId', sessionId, { maxAge: 60 * 60 * 24 * 30, path: '/' })
    }

    // Find or create cart
    let cart = await prisma.cart.findFirst({
      where: session?.user?.id
        ? { userId: Number(session.user.id) }
        : { sessionId: sessionId }
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          sessionId: sessionId,
          userId: session?.user?.id ? Number(session.user.id) : null
        }
      })
    }

    // Add to cart
    const cartItem = await prisma.cartItem.upsert({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: Number(productId)
        }
      },
      update: {
        quantity: { increment: Number(quantity) }
      },
      create: {
        cartId: cart.id,
        productId: Number(productId),
        quantity: Number(quantity)
      }
    })

    return Response.json({ cartItem })
  } catch (error) {
    console.error('Cart Add POST error:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}