import { prisma } from '@/lib/prisma-server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

async function adminGuard() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || session.user.role !== 1) return null
    return session
}

// GET all orders
export async function GET() {
    const session = await adminGuard()
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 403 })

    try {
        const orders = await prisma.order.findMany({
            include: {
                items: { include: { product: true } },
                user: { select: { name: true, email: true } }
            },
            orderBy: { createdAt: 'desc' }
        })
        return Response.json({ orders })
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 })
    }
}
