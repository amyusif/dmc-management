import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { PersonalDataUpdateSchema } from '@/lib/schemas'

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
    const data = PersonalDataUpdateSchema.parse(body)

    const updateData: {
      fullName?: string
      email?: string | null
      phone?: string | null
      idType?: string | null
      idNumber?: string | null
      dateOfBirth?: Date | null
      address?: string | null
      notes?: string | null
    } = {}
    if (data.fullName !== undefined) updateData.fullName = data.fullName
    if (data.email !== undefined) updateData.email = data.email || null
    if (data.phone !== undefined) updateData.phone = data.phone || null
    if (data.idType !== undefined) updateData.idType = data.idType || null
    if (data.idNumber !== undefined) updateData.idNumber = data.idNumber || null
    if (data.dateOfBirth !== undefined) {
      updateData.dateOfBirth = data.dateOfBirth ? new Date(data.dateOfBirth) : null
    }
    if (data.address !== undefined) updateData.address = data.address || null
    if (data.notes !== undefined) updateData.notes = data.notes || null

    const item = await prisma.personalData.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(item)
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to update record' },
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
    await prisma.personalData.delete({ where: { id } })
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('DELETE /api/personal-data/[id] error:', error)
    return NextResponse.json(
      { error: 'Failed to delete record' },
      { status: 500 }
    )
  }
}
