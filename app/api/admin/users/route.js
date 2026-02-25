import { prisma } from '@/lib/prisma-server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

async function adminGuard() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || session.user.role !== 1) return null
    return session
}

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
