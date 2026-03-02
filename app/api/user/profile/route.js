import { prisma } from '@/lib/prisma-server'
import { auth } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function GET() {
    const session = await auth()
    if (!session?.user?.id) {
        return Response.json({ error: 'Not authenticated' }, { status: 401 })
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: Number(session.user.id) },
            include: {
                addresses: true,
                _count: { select: { orders: true } }
            }
        })

        if (!user) return Response.json({ error: 'User not found' }, { status: 404 })

        const { password, ...safeUser } = user
        return Response.json(safeUser)
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 })
    }
}

export async function PUT(request) {
    const session = await auth()
    if (!session?.user?.id) {
        return Response.json({ error: 'Not authenticated' }, { status: 401 })
    }

    try {
        const body = await request.json()
        const { name, image, newPassword, address, isAddingAddress } = body

        // If adding address
        if (isAddingAddress && address) {
            await prisma.address.create({
                data: {
                    ...address,
                    userId: Number(session.user.id)
                }
            })
        }

        const updateData = {}
        if (name) updateData.name = name
        if (image) updateData.image = image
        if (newPassword) {
            updateData.password = await bcrypt.hash(newPassword, 10)
        }

        const updatedUser = await prisma.user.update({
            where: { id: Number(session.user.id) },
            data: updateData
        })

        const { password, ...safeUser } = updatedUser
        return Response.json(safeUser)
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 })
    }
}
