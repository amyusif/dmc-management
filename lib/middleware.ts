import { NextRequest, NextResponse } from 'next/server'
import { getSession } from './auth'

export async function withAuth(request: NextRequest, handler: Function) {
  const session = await getSession()
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  return handler(request, session)
}

export async function withRole(
  request: NextRequest,
  allowedRoles: string[],
  handler: Function
) {
  const session = await getSession()
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // Get user to check role
  const { prisma } = await import('./db')
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
  })
  
  if (!user || !allowedRoles.includes(user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  
  return handler(request, session, user)
}
