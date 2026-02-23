import { prisma } from '@/lib/prisma-server'
import { cookies } from 'next/headers'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request) {
  try {
    const { productId, quantity = 1 } = await request.json()
    const session = await getServerSession(authOptions)
    const cookieStore = await cookies()
    let sessionId = cookieStore.get('sessionId')?.value

    if (!sessionId && !session?.user?.id) {
      sessionId = uuidv4()
      cookieStore.set('sessionId', sessionId, { maxAge: 60 * 60 * 24 * 30, path: '/' })
    }

    // Find or create cart
    let cart = await prisma.cart.findFirst({
      where: session?.user?.id 
        ? { userId: session.user.id }
        : { sessionId: sessionId }
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: session?.user?.id 
          ? { userId: session.user.id }
          : { sessionId: sessionId }
      })
    }

    // Add to cart
    const cartItem = await prisma.cartItem.upsert({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: parseInt(productId)
        }
      },
      update: {
        quantity: { increment: quantity }
      },
      create: {
        cartId: cart.id,
        productId: parseInt(productId),
        quantity
      }
    })

    return Response.json({ cartItem })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}