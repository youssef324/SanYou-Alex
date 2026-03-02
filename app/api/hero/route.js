import { prisma } from '@/lib/prisma-server'

export async function GET() {
    try {
        const hero = await prisma.heroSection.findFirst({
            where: { isActive: true },
            orderBy: { updatedAt: 'desc' }
        })

        return Response.json(hero || {
            tagline: "SanYou is not just Make-up or Skincare - it's a feeling of elegance you can wear everyday",
            buttonText: "Shop Now",
            buttonLink: "/products",
            image: null
        })
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 })
    }
}
