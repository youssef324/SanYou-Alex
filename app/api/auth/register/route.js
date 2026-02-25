import { prisma } from '@/lib/prisma-server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const ADMIN_SECRET_CODE = 'SMARTSTORE2026'

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  adminCode: z.string().optional()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

export async function POST(request) {
  try {
    const body = await request.json()

    const result = registerSchema.safeParse(body)
    if (!result.success) {
      return Response.json({
        error: 'Validation failed',
        details: result.error.errors
      }, { status: 400 })
    }

    const { name, email, password, adminCode } = result.data

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return Response.json({
        error: 'Email already registered'
      }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    // Determine role based on admin secret code
    const role = adminCode === ADMIN_SECRET_CODE ? 1 : 0

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role
      }
    })

    return Response.json({
      message: 'Account created successfully!',
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    }, { status: 201 })

  } catch (error) {
    console.error('Registration error:', error)
    return Response.json({
      error: 'Registration failed. Please try again.'
    }, { status: 500 })
  }
}