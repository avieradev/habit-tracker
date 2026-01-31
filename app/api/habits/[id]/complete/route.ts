import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

function getTokenFromRequest(request: Request): string | null {
  const authHeader = request.headers.get('Authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7)
  }
  return null
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = getTokenFromRequest(request)
  
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const payload = verifyToken(token)
  if (!payload) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }

  const { id } = await params
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  try {
    const completion = await prisma.completion.create({
      data: {
        habitId: id,
        userId: payload.userId,
        date: today
      }
    })
    return NextResponse.json(completion, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Already completed today' }, { status: 409 })
  }
}
