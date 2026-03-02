import { prisma } from '@/lib/prisma-server'
import { auth } from '@/lib/auth'

// GET - list user's favourites
export async function GET() {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return Response.json({ favourites: [] })
        }

        const favourites = await prisma.favourite.findMany({
            where: { userId: session.user.id },
            include: { product: { include: { category: true } } },
            orderBy: { createdAt: 'desc' }
        })

        return Response.json({ favourites })
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 })
    }
}

// POST - add to favourites
export async function POST(request) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return Response.json({ error: 'Not authenticated' }, { status: 401 })
        }

        const { productId } = await request.json()
        if (!productId) {
            return Response.json({ error: 'Product ID is required' }, { status: 400 })
        }

        const favourite = await prisma.favourite.create({
            data: {
                userId: Number(session.user.id),
                productId: Number(productId)
            }
        })

        return Response.json({ favourite })
    } catch (error) {
        console.error('Favourites POST error:', error)
        if (error.code === 'P2002') {
            return Response.json({ error: 'Already in favourites' }, { status: 400 })
        }
        return Response.json({ error: error.message }, { status: 500 })
    }
}

// DELETE - remove from favourites
export async function DELETE(request) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return Response.json({ error: 'Not authenticated' }, { status: 401 })
        }

        const { productId } = await request.json()
        if (!productId) {
            return Response.json({ error: 'Product ID is required' }, { status: 400 })
        }

        await prisma.favourite.deleteMany({
            where: {
                userId: Number(session.user.id),
                productId: Number(productId)
            }
        })

        return Response.json({ success: true })
    } catch (error) {
        console.error('Favourites DELETE error:', error)
        return Response.json({ error: error.message }, { status: 500 })
    }
}
