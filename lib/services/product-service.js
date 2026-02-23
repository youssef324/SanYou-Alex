import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export async function getAllProducts() {
  try {
    const products = await prisma.product.findMany({
      include: { category: true }
    })
    return products
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

export async function getProductById(id) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: { category: true }
    })
    return product
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

export async function getAllCategories() {
  try {
    const categories = await prisma.category.findMany({
      include: { products: true }
    })
    return categories
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}