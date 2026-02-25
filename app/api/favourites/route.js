import { prisma } from '@/lib/prisma-server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

// GET - list user's favourites
export async function GET() {
    try {
        const session = await getServerSession(authOptions)
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
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return Response.json({ error: 'Not authenticated' }, { status: 401 })
        }

        const { productId } = await request.json()

        const favourite = await prisma.favourite.create({
            data: {
                userId: session.user.id,
                productId: parseInt(productId)
            }
        })

        return Response.json({ favourite })
    } catch (error) {
        if (error.code === 'P2002') {
            return Response.json({ error: 'Already in favourites' }, { status: 400 })
        }
        return Response.json({ error: error.message }, { status: 500 })
    }
}

// DELETE - remove from favourites
export async function DELETE(request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return Response.json({ error: 'Not authenticated' }, { status: 401 })
        }

        const { productId } = await request.json()

        await prisma.favourite.deleteMany({
            where: {
                userId: session.user.id,
                productId: parseInt(productId)
            }
        })

        return Response.json({ success: true })
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 })
    }
}
