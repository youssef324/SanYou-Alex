import { prisma } from '@/lib/prisma-server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

// Get or create cart for user/session
export async function getOrCreateCart(sessionId, userId = null) {
  try {
    let cart = await prisma.cart.findFirst({
      where: userId ? { userId } : { sessionId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: userId ? { userId } : { sessionId },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      })
    }

    return cart
  } catch (error) {
    console.error('Error in getOrCreateCart:', error)
    return null
  }
}

// Add to cart
export async function addToCart(cartId, productId, quantity = 1) {
  try {
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId,
          productId
        }
      }
    })

    if (existingItem) {
      return await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity }
      })
    } else {
      return await prisma.cartItem.create({
        data: {
          cartId,
          productId,
          quantity
        }
      })
    }
  } catch (error) {
    console.error('Error adding to cart:', error)
    return null
  }
}

// Get cart with items
export async function getCartWithItems(cartId) {
  try {
    return await prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    })
  } catch (error) {
    console.error('Error getting cart:', error)
    return null
  }
}