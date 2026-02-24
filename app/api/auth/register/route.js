import { prisma } from '@/lib/prisma-server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

// Validation schema
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

export async function POST(request) {
  try {
    const body = await request.json()
    
    // Validate input
    const result = registerSchema.safeParse(body)
    if (!result.success) {
      return Response.json({ 
        error: 'Validation failed', 
        details: result.error.errors 
      }, { status: 400 })
    }

    const { name, email, password } = result.data

    // Check if user exists (prepared statement)
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return Response.json({ 
        error: 'Email already registered' 
      }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user (prepared statement)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    })

    return Response.json({ 
      message: 'Account created successfully!',
      user: { id: user.id, name: user.name, email: user.email }
    }, { status: 201 })

  } catch (error) {
    console.error('Registration error:', error)
    return Response.json({ 
      error: 'Registration failed. Please try again.' 
    }, { status: 500 })
  }
}