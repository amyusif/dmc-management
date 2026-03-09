import { NextRequest, NextResponse } from 'next/server'
import { registerUser, createSession } from '@/lib/auth'
import { RegisterSchema } from '@/lib/schemas'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = RegisterSchema.parse(body)
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { username: validatedData.username },
    })
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'Username already registered' },
        { status: 409 }
      )
    }
    
    // Create user
    const user = await registerUser(
      validatedData.username,
      validatedData.password,
      validatedData.name,
      validatedData.email,
      validatedData.role
    )

    if (!user) {
      return NextResponse.json(
        { error: 'Registration failed' },
        { status: 500 }
      )
    }

    // Create session
    await createSession(user.id)
    
    // Return user data
    const userData = {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
    }
    
    return NextResponse.json(userData, { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
