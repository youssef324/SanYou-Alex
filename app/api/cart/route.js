import { prisma } from '@/lib/prisma-server'
import { cookies } from 'next/headers'
import { auth } from '@/lib/auth'

export async function GET() {
  try {
    const session = await auth()
    const cookieStore = await cookies()
    const sessionId = cookieStore.get('sessionId')?.value

    let cart = await prisma.cart.findFirst({
      where: session?.user?.id
        ? { userId: Number(session.user.id) }
        : { sessionId: sessionId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    })

    return Response.json({ cart: cart || { items: [] } })
  } catch (error) {
    console.error('Cart API error:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}