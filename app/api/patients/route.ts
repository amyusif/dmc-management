import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { PatientSchema } from '@/lib/schemas'

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
            { firstName: { contains: search, mode: 'insensitive' as const } },
            { lastName: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
            { phone: { contains: search } },
          ],
        }
      : {}

    const patients = await prisma.patient.findMany({
      where,
      orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
    })

    return NextResponse.json(patients)
  } catch (error) {
    console.error('GET /api/patients error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch patients' },
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
    const data = PatientSchema.parse(body)

    const existing = await prisma.patient.findUnique({
      where: { email: data.email },
    })
    if (existing) {
      return NextResponse.json(
        { error: 'A patient with this email already exists' },
        { status: 409 }
      )
    }

    const patient = await prisma.patient.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        dateOfBirth: new Date(data.dateOfBirth),
        gender: data.gender,
        bloodType: data.bloodType ?? null,
        address: data.address ?? null,
        city: data.city ?? null,
        state: data.state ?? null,
        zipCode: data.zipCode ?? null,
        emergencyContact: data.emergencyContact ?? null,
      },
    })

    return NextResponse.json(patient, { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create patient' },
      { status: 500 }
    )
  }
}
