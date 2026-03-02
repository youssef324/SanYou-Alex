const { PrismaClient } = require('@prisma/client')
require('dotenv').config({ path: '.env.local' })

// Check if environment variable is loaded
const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  console.error('❌ DATABASE_URL is NOT set in environment variables!')
  process.exit(1)
}
console.log('✅ DATABASE_URL loaded successfully')


const prisma = new PrismaClient()

async function main() {
  try {
    console.log('Attempting to connect to database...')

    // Test connection
    await prisma.$queryRaw`SELECT 1`
    console.log('✅ Database connection successful')

    // 1. Create categories dynamically (IDs are handled by autoincrement)
    console.log('Creating/Updating categories...')
    const skincare = await prisma.category.upsert({
      where: { slug: "skincare" },
      update: {},
      create: {
        name: "Skincare",
        slug: "skincare",
        description: "Products for healthy and glowing skin"
      }
    })

    const haircare = await prisma.category.upsert({
      where: { slug: "haircare" },
      update: {},
      create: {
        name: "Haircare",
        slug: "haircare",
        description: "Products for beautiful and strong hair"
      }
    })

    const nails = await prisma.category.upsert({
      where: { slug: "nails" },
      update: {},
      create: {
        name: "Nails",
        slug: "nails",
        description: "Effective nail products"
      }
    })
    const babies = await prisma.category.upsert({
      where: { slug: "babies" },
      update: {},
      create: {
        name: "Babies",
        slug: "babies",
        description: "Effective babies products"
      }
    })
    const makeup = await prisma.category.upsert({
      where: { slug: "makeup" },
      update: {},
      create: {
        name: "Make-up",
        slug: "make-up",
        description: "Effective makeup products"
      }
    })

    // 2. Define Products using actual category IDs
    console.log('Upserting products...')
    const products = [
      {
        name: "Vacation retinol serum",
        price: 325,
        categoryId: skincare.id,
        image: "/images/products/Vacation-retinol-serum-30-ml-325-LE.jpeg",
        description: "Retinol serum for skin renewal - 30ml",
        inStock: true
      },
      {
        name: "PURE SKIN CLEANSER",
        price: 105,
        categoryId: skincare.id,
        image: "/images/products/Pure-skin-cleanser-200-ml-105-LE.jpeg",
        description: "Gentle skin cleanser - 200ml",
        inStock: true
      },
      {
        name: "Kolagra Oily skin cleanser",
        price: 105,
        categoryId: skincare.id,
        image: "/images/products/Kolagra-Oily-skin-cleanser-200ml-105LE.jpeg",
        description: "For oily skin - 200ml",
        inStock: true
      },
      {
        name: "COSRX advanced snail 96 mucin power essence",
        price: 730,
        categoryId: skincare.id,
        image: "/images/products/COSRX-advanced-snail-96-mucin-power-100-ml-730LE.jpeg",
        description: "Snail mucin essence - 100ml",
        inStock: true
      },
      {
        name: "COSRX advanced snail 92 all in one cream",
        price: 730,
        categoryId: skincare.id,
        image: "/images/products/COSRX-advanced-snail-92-all-in-one-cream-100-gm-730-LE.jpeg",
        description: "All-in-one cream - 100g",
        inStock: true
      },
      {
        name: "KOLAGRA SHAMPOO",
        price: 105,
        categoryId: haircare.id,
        image: "/images/products/KOLAGRA-SHAMPOO-200ml-105-LE.jpeg",
        description: "Nourishing shampoo - 200ml",
        inStock: true
      },
      {
        name: "Fino shampoo and conditioner set",
        price: 725,
        categoryId: haircare.id,
        image: "/images/products/Fino-shampoo-and-conditioner-set-300ml-725-LE.jpeg",
        description: "Complete hair care set - 300ml",
        inStock: true
      },
      {
        name: "Starville facial cleanser",
        price: 150,
        categoryId: skincare.id,
        image: "/images/products/Starville-facial-cleanser-300-ml-150-LE-100-ml-75Le.jpeg",
        description: "Facial cleanser - 300ml",
        inStock: true
      },
      {
        name: "Starville hyaluronic acid serum",
        price: 225,
        categoryId: skincare.id,
        image: "/images/products/Starville-hyaluronic-acid-serum-30-ml-225LE.jpeg",
        description: "Hyaluronic acid serum - 30ml",
        inStock: true
      },
      {
        name: "Twist and go anti hair loss lotion spray",
        price: 290,
        categoryId: haircare.id,
        image: "/images/products/Twist-and-go-anti-hair-loss-lotion-spray-250-ml-290-LE.jpeg",
        description: "Anti hair loss spray - 250ml",
        inStock: true
      }
    ]

    // Manual upsert for non-unique "name" field
    for (const product of products) {
      const existing = await prisma.product.findFirst({
        where: { name: product.name }
      })

      if (existing) {
        await prisma.product.update({
          where: { id: existing.id },
          data: product
        })
        console.log(`✅ Updated: ${product.name}`)
      } else {
        await prisma.product.create({
          data: product
        })
        console.log(`✅ Created: ${product.name}`)
      }
    }

    console.log("✅ Seeding completed successfully")
    const validProducts = await prisma.product.count()
    const validCategories = await prisma.category.count()
    console.log(`📦 ${validProducts} products in database`)
    console.log(`📁 ${validCategories} categories in database`)
  } catch (error) {
    console.error('❌ Database seeding error:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .then(() => {
    console.log('✅ Seed process finished successfully')
    process.exit(0)
  })
  .catch((e) => {
    console.error('❌ Seed process failed:', e)
    process.exit(1)
  })