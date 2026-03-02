import { prisma } from '@/lib/prisma-server'
import { cookies } from 'next/headers'
import { auth } from '@/lib/auth'

export async function DELETE(request) {
  try {
    const { cartItemId } = await request.json()
    const session = await auth()
    const cookieStore = await cookies()
    const sessionId = cookieStore.get('sessionId')?.value

    // check if the cart item exists
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: Number(cartItemId) },
      include: { cart: true }
    })

    if (!cartItem) {
      return Response.json({ error: 'Item not found' }, { status: 404 })
    }

    // Check ownership
    const isOwner = session?.user?.id
      ? Number(cartItem.cart.userId) === Number(session.user.id)
      : cartItem.cart.sessionId === sessionId;

    if (!isOwner) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.cartItem.delete({
      where: { id: Number(cartItemId) }
    })

    return Response.json({ success: true })

  } catch (error) {
    console.error('Remove error:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}