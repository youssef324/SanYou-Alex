import { prisma } from '@/lib/prisma-server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

// Admin guard helper
async function adminGuard() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || session.user.role !== 1) {
        return null
    }
    return session
}

export async function GET() {
    const session = await adminGuard()
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 403 })

    try {
        const [totalProducts, totalOrders, totalUsers, revenueResult, topProducts, recentOrders] = await Promise.all([
            prisma.product.count(),
            prisma.order.count(),
            prisma.user.count(),
            prisma.order.aggregate({ _sum: { total: true } }),
            prisma.product.findMany({
                take: 5,
                orderBy: { orderItems: { _count: 'desc' } },
                include: { _count: { select: { orderItems: true } } }
            }),
            prisma.order.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' }
            })
        ])

        return Response.json({
            totalProducts,
            totalOrders,
            totalRevenue: revenueResult._sum.total || 0,
            totalUsers,
            topProducts,
            recentOrders
        })
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 })
    }
}
