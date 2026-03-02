import { prisma } from '@/lib/prisma-server'
import { auth } from '@/lib/auth'

export async function GET() {
    const session = await auth()
    if (!session?.user?.id) {
        return Response.json({ error: 'Not authenticated' }, { status: 401 })
    }

    try {
        const orders = await prisma.order.findMany({
            where: { userId: session.user.id },
            include: {
                items: {
                    include: { product: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        })
        return Response.json({ orders })
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 })
    }
}
