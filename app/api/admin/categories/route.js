import { prisma } from '@/lib/prisma-server'
import { adminGuard } from '@/lib/admin-guard'

// GET all categories for admin
export async function GET() {
    const session = await adminGuard()
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 403 })

    try {
        const categories = await prisma.category.findMany({
            include: { _count: { select: { products: true } } },
            orderBy: { createdAt: 'desc' }
        })
        return Response.json(categories)
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 })
    }
}

// POST new category
export async function POST(request) {
    const session = await adminGuard()
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 403 })

    try {
        const { name, slug, description, image } = await request.json()
        const category = await prisma.category.create({
            data: { name, slug, description, image }
        })
        return Response.json(category)
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 })
    }
}
