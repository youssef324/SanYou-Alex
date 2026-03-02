import { prisma } from '@/lib/prisma-server'
import { adminGuard } from '@/lib/admin-guard'

// GET single category
export async function GET(request, { params }) {
    const session = await adminGuard()
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 403 })

    try {
        const { id } = await params
        const category = await prisma.category.findUnique({
            where: { id: parseInt(id) }
        })
        if (!category) return Response.json({ error: 'Not found' }, { status: 404 })
        return Response.json(category)
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 })
    }
}

// PUT update category
export async function PUT(request, { params }) {
    const session = await adminGuard()
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 403 })

    try {
        const { id } = await params
        const { name, slug, description, image } = await request.json()
        const category = await prisma.category.update({
            where: { id: parseInt(id) },
            data: { name, slug, description, image }
        })
        return Response.json(category)
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 })
    }
}

// DELETE category
export async function DELETE(request, { params }) {
    const session = await adminGuard()
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 403 })

    try {
        const { id } = await params
        // Check if category has products
        const productsCount = await prisma.product.count({ where: { categoryId: parseInt(id) } })
        if (productsCount > 0) return Response.json({ error: 'Cannot delete category with products' }, { status: 400 })

        await prisma.category.delete({ where: { id: parseInt(id) } })
        return Response.json({ success: true })
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 })
    }
}
