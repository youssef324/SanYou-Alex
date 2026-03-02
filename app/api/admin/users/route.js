import { prisma } from '@/lib/prisma-server'
import { adminGuard } from '@/lib/admin-guard'

// GET all users
export async function GET() {
    const session = await adminGuard()
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 403 })

    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                _count: { select: { orders: true } }
            },
            orderBy: { createdAt: 'desc' }
        })
        return Response.json({ users })
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 })
    }
}
