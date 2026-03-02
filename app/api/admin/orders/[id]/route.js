import { prisma } from '@/lib/prisma-server'
import { adminGuard } from '@/lib/admin-guard'

// GET single order
export async function GET(request, { params }) {
    const session = await adminGuard()
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 403 })

    try {
        const { id } = await params
        const order = await prisma.order.findUnique({
            where: { id: parseInt(id) },
            include: {
                items: { include: { product: true } },
                user: { select: { name: true, email: true } }
            }
        })
        if (!order) return Response.json({ error: 'Not found' }, { status: 404 })
        return Response.json({ order })
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 })
    }
}

// PUT update order status
export async function PUT(request, { params }) {
    const session = await adminGuard()
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 403 })

    try {
        const { id } = await params
        const { status } = await request.json()
        const order = await prisma.order.update({
            where: { id: parseInt(id) },
            data: { status }
        })
        return Response.json({ order })
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 })
    }
}
