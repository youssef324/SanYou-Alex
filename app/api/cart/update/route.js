import { prisma } from '@/lib/prisma-server'
import { cookies } from 'next/headers'
import { auth } from '@/lib/auth'

export async function PUT(request) {
  try {
    const { cartItemId, quantity } = await request.json()
    const session = await auth()
    const cookieStore = await cookies()
    const sessionId = cookieStore.get('sessionId')?.value

    // check if the cart item exists
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: parseInt(cartItemId) },
      include: { cart: true }
    })

    if (!cartItem) {
      return Response.json({ error: 'Item not found' }, { status: 404 })
    }
    // check if the cart belongs to the user
    const isOwner = session?.user?.id
      ? Number(cartItem.cart.userId) === Number(session.user.id)
      : cartItem.cart.sessionId === sessionId;

    if (!isOwner) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Update quantity
    const updatedItem = await prisma.cartItem.update({
      where: { id: parseInt(cartItemId) },
      data: { quantity },
      include: { product: true }
    })

    return Response.json({ cartItem: updatedItem })
  } catch (error) {
    console.error('Update error:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}