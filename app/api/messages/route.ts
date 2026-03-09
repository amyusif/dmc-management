import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { MessageSchema } from '@/lib/schemas'

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const messages = await prisma.message.findMany({
      take: 100,
      orderBy: { createdAt: 'desc' },
      include: {
        sender: { select: { id: true, name: true, role: true } },
      },
    })

    return NextResponse.json(messages)
  } catch (error) {
    console.error('GET /api/messages error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
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
    const data = MessageSchema.parse(body)

    const message = await prisma.message.create({
      data: {
        senderId: session.userId,
        content: data.content,
        recipientType: data.recipientType,
        recipientRole: data.recipientRole ?? null,
      },
      include: {
        sender: { select: { id: true, name: true, role: true } },
      },
    })

    return NextResponse.json(message, { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
