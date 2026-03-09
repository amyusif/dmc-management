import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')?.trim() || ''

    const where = search
      ? {
          OR: [
            { user: { name: { contains: search, mode: 'insensitive' as const } } },
            { user: { email: { contains: search, mode: 'insensitive' as const } } },
            { phone: { contains: search } },
            { position: { contains: search, mode: 'insensitive' as const } },
            { department: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {}

    const staff = await prisma.staff.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            email: true,
            role: true,
            avatar: true,
            active: true,
          },
        },
      },
      orderBy: { user: { name: 'asc' } },
    })

    return NextResponse.json(staff)
  } catch (error) {
    console.error('GET /api/staff error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch staff' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { userId, position, department, phone } = body

    if (!userId || !position || !department) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, position, department' },
        { status: 400 }
      )
    }

    const staff = await prisma.staff.create({
      data: {
        userId,
        position,
        department,
        phone: phone || null,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            email: true,
            role: true,
            avatar: true,
            active: true,
          },
        },
      },
    })

    return NextResponse.json(staff, { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create staff' },
      { status: 500 }
    )
  }
}

