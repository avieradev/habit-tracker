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

export async function GET(request: Request) {
  const token = getTokenFromRequest(request)
  
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const payload = verifyToken(token)
  if (!payload) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }

  const habits = await prisma.habit.findMany({
    where: { active: true },
    include: {
      completions: {
        where: { userId: payload.userId },
        orderBy: { date: 'desc' }
      }
    }
  })

  return NextResponse.json(habits)
}
