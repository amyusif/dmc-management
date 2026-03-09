import { NextRequest, NextResponse } from 'next/server'
import { clearSession, getSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // Check if user is logged in
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Not logged in' },
        { status: 401 }
      )
    }
    
    // Clear session
    await clearSession()
    
    return NextResponse.json({ message: 'Logged out successfully' })
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
