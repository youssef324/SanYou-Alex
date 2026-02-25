import { prisma } from '@/lib/prisma-server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

async function adminGuard() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || session.user.role !== 1) return null
    return session
}

// GET all products (admin)
export async function GET() {
    const session = await adminGuard()
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 403 })

    try {
        const products = await prisma.product.findMany({
            include: { category: true },
            orderBy: { createdAt: 'desc' }
        })
        return Response.json({ products })
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 })
    }
}

// POST create product
export async function POST(request) {
    const session = await adminGuard()
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 403 })

    try {
        const body = await request.json()
        const product = await prisma.product.create({
            data: {
                name: body.name,
                description: body.description,
                price: body.price,
                image: body.image,
                categoryId: body.categoryId,
                brand: body.brand || null,
                ingredients: body.ingredients || null,
                inventory: body.inventory || 0,
                inStock: body.inStock ?? true,
                isFeatured: body.isFeatured ?? false
            }
        })
        return Response.json({ product })
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 })
    }
}
