import { prisma } from '@/lib/prisma-server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return Response.json({ error: 'Not authenticated' }, { status: 401 })
        }

        const { shippingAddress, customerPhone, notes } = await request.json()

        // Get user's cart with items
        const cart = await prisma.cart.findFirst({
            where: { userId: session.user.id },
            include: {
                items: {
                    include: { product: true }
                }
            }
        })

        if (!cart || cart.items.length === 0) {
            return Response.json({ error: 'Cart is empty' }, { status: 400 })
        }

        // Calculate total
        const total = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

        // Generate order number
        const orderNumber = `SS-${Date.now().toString(36).toUpperCase()}`

        // Create order with items
        const order = await prisma.order.create({
            data: {
                orderNumber,
                userId: session.user.id,
                customerName: session.user.name || 'Customer',
                customerEmail: session.user.email,
                customerPhone: customerPhone || null,
                shippingAddress: shippingAddress || '',
                total,
                status: 'PENDING',
                items: {
                    create: cart.items.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.product.price
                    }))
                }
            },
            include: { items: true }
        })

        // Clear the cart
        await prisma.cartItem.deleteMany({
            where: { cartId: cart.id }
        })

        return Response.json({ order, orderNumber })
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 })
    }
}
