import { prisma } from '@/lib/prisma-server'
import bcrypt from 'bcryptjs'

export async function POST(request) {
  try {
    const { email, password, name } = await request.json()

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return Response.json({ error: 'User already exists' }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name
      }
    })

    return Response.json({ 
      message: 'User created successfully',
      user: { id: user.id, email: user.email, name: user.name }
    }, { status: 201 })
  } catch (error) {
    console.error('Registration error:', error)
    return Response.json({ error: 'Registration failed' }, { status: 500 })
  }
}