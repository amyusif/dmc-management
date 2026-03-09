import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { PersonalDataSchema } from '@/lib/schemas'

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
            { fullName: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
            { phone: { contains: search } },
            { idNumber: { contains: search } },
            { address: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {}

    const items = await prisma.personalData.findMany({
      where,
      orderBy: { fullName: 'asc' },
    })

    return NextResponse.json(items)
  } catch (error) {
    console.error('GET /api/personal-data error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch personal data' },
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
    const data = PersonalDataSchema.parse(body)

    const item = await prisma.personalData.create({
      data: {
        fullName: data.fullName,
        email: data.email || null,
        phone: data.phone || null,
        idType: data.idType || null,
        idNumber: data.idNumber || null,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        address: data.address || null,
        notes: data.notes || null,
      },
    })

    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create record' },
      { status: 500 }
    )
  }
}
