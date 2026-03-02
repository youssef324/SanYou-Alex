import { prisma } from '@/lib/prisma-server'
import { adminGuard } from '@/lib/admin-guard'

// GET single product
export async function GET(request, { params }) {
    const session = await adminGuard()
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 403 })

    try {
        const { id } = await params
        const product = await prisma.product.findUnique({
            where: { id: parseInt(id) },
            include: { category: true }
        })
        if (!product) return Response.json({ error: 'Not found' }, { status: 404 })
        return Response.json(product)
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 })
    }
}

// PUT update product
export async function PUT(request, { params }) {
    const session = await adminGuard()
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 403 })

    try {
        const { id } = await params
        const body = await request.json()
        const product = await prisma.product.update({
            where: { id: parseInt(id) },
            data: {
                name: body.name,
                description: body.description,
                price: parseFloat(body.price),
                discount: parseFloat(body.discount || 0),
                image: body.image,
                images: body.images || [],
                colorVariants: body.colorVariants || [],
                categoryId: parseInt(body.categoryId),
                brand: body.brand || null,
                ingredients: body.ingredients || null,
                inventory: parseInt(body.inventory || 0),
                inStock: body.inStock ?? true,
                isFeatured: body.isFeatured ?? false,
                isHidden: body.isHidden ?? false
            }
        })
        return Response.json({ product })
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 })
    }
}

// DELETE product
export async function DELETE(request, { params }) {
    const session = await adminGuard()
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 403 })

    try {
        const { id } = await params
        await prisma.product.delete({ where: { id: parseInt(id) } })
        return Response.json({ success: true })
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 })
    }
}
