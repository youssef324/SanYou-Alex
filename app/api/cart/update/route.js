import { prisma } from '@/lib/prisma-server'
import { cookies } from 'next/headers'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function POST(request) {
  try {
    const { cartItemId, quantity } = await request.json()
    const session = await getServerSession(authOptions)
    const cookieStore = await cookies()
    const sessionId = cookieStore.get('sessionId')?.value

    //check if the cart belongs to the user  
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: parseInt(cartItemId) },
      include: { cart: true }
    })

    if (!cartItem) {
      return Response.json({ error: 'Item not found' }, { status: 404 })
    }
    // check if the cart item exists
    if (cartItem.cart.userId !== session?.user?.id && 
        cartItem.cart.sessionId !== sessionId) {
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