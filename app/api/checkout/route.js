import { prisma } from '@/lib/prisma-server'
import { auth } from '@/lib/auth'
import { stripe } from '@/lib/stripe'

export async function POST(request) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return Response.json({ error: 'Not authenticated' }, { status: 401 })
        }

        const { address, phone, name, email, paymentMethod } = await request.json()

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

        // Calculate total with discounts
        const total = cart.items.reduce((sum, item) => {
            const price = item.product.discount > 0
                ? item.product.price * (1 - item.product.discount / 100)
                : item.product.price;
            return sum + (price * item.quantity);
        }, 0)

        // Generate order number
        const orderNumber = `SY-${Date.now().toString(36).toUpperCase()}`

        // Create order with items
        const order = await prisma.order.create({
            data: {
                orderNumber,
                userId: Number(session.user.id),
                customerName: name || session.user.name || 'Customer',
                customerEmail: email || session.user.email,
                customerPhone: phone || null,
                shippingAddress: address || '',
                total,
                status: 'PENDING',
                paymentMethod: paymentMethod || 'COD',
                paymentStatus: 'PENDING',
                items: {
                    create: cart.items.map(item => {
                        const finalPrice = item.product.discount > 0
                            ? item.product.price * (1 - item.product.discount / 100)
                            : item.product.price;
                        return {
                            productId: item.productId,
                            quantity: item.quantity,
                            price: finalPrice,
                            color: item.color
                        }
                    })
                }
            },
            include: { items: true }
        })

        // Clear the cart
        await prisma.cartItem.deleteMany({
            where: { cartId: cart.id }
        })

        // If it's a card payment, create a Stripe session
        let stripeUrl = null;
        if (paymentMethod === 'CARD') {
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: cart.items.map(item => ({
                    price_data: {
                        currency: 'egp',
                        product_data: {
                            name: item.product.name,
                            images: [item.product.image].filter(Boolean),
                        },
                        unit_amount: Math.round((item.product.discount > 0
                            ? item.product.price * (1 - item.product.discount / 100)
                            : item.product.price) * 100),
                    },
                    quantity: item.quantity,
                })),
                mode: 'payment',
                success_url: `${process.env.NEXTAUTH_URL}/orders/success?id=${order.orderNumber}&success=true`,
                cancel_url: `${process.env.NEXTAUTH_URL}/checkout?error=payment_cancelled`,
                customer_email: email || session.user.email,
                metadata: {
                    orderId: order.id,
                    orderNumber: order.orderNumber
                }
            });
            stripeUrl = session.url;
        }

        return Response.json({
            success: true,
            orderId: order.id,
            orderNumber,
            stripeUrl
        })
    } catch (error) {
        console.error('Checkout Error:', error)
        return Response.json({ error: error.message }, { status: 500 })
    }
}
