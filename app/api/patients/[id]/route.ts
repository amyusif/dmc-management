import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { PatientUpdateSchema } from '@/lib/schemas'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const data = PatientUpdateSchema.parse(body)

    if (data.email) {
      const existing = await prisma.patient.findFirst({
        where: { email: data.email, NOT: { id } },
      })
      if (existing) {
        return NextResponse.json(
          { error: 'A patient with this email already exists' },
          { status: 409 }
        )
      }
    }

    const updateData: {
      firstName?: string
      lastName?: string
      email?: string
      phone?: string
      dateOfBirth?: Date
      gender?: string
      bloodType?: string | null
      address?: string | null
      city?: string | null
      state?: string | null
      zipCode?: string | null
      emergencyContact?: string | null
    } = {}
    if (data.firstName !== undefined) updateData.firstName = data.firstName
    if (data.lastName !== undefined) updateData.lastName = data.lastName
    if (data.email !== undefined) updateData.email = data.email
    if (data.phone !== undefined) updateData.phone = data.phone
    if (data.dateOfBirth !== undefined) updateData.dateOfBirth = new Date(data.dateOfBirth)
    if (data.gender !== undefined) updateData.gender = data.gender
    if (data.bloodType !== undefined) updateData.bloodType = data.bloodType || null
    if (data.address !== undefined) updateData.address = data.address || null
    if (data.city !== undefined) updateData.city = data.city || null
    if (data.state !== undefined) updateData.state = data.state || null
    if (data.zipCode !== undefined) updateData.zipCode = data.zipCode || null
    if (data.emergencyContact !== undefined) updateData.emergencyContact = data.emergencyContact || null

    const patient = await prisma.patient.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(patient)
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to update patient' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    await prisma.patient.delete({
      where: { id },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('DELETE /api/patients/[id] error:', error)
    return NextResponse.json(
      { error: 'Failed to delete patient' },
      { status: 500 }
    )
  }
}
