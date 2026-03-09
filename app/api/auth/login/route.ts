import { NextRequest, NextResponse } from 'next/server'
import { loginUser, createSession } from '@/lib/auth'
import { LoginSchema } from '@/lib/schemas'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = LoginSchema.parse(body)
    
    // Find and verify user
    const user = await loginUser(validatedData.username, validatedData.password)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      )
    }
    
    // Create session
    await createSession(user.id)
    
    return NextResponse.json({
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
      active: user.active,
    })
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
