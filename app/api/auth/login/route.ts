import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, generateToken } from '@/lib/auth'

export async function POST(request: Request) {
  const { username, password } = await request.json()

  const user = await prisma.user.findUnique({
    where: { username }
  })

  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const isValid = await verifyPassword(password, user.password)

  if (!isValid) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const token = generateToken(user.id)

  return NextResponse.json({ 
    token,
    user: { id: user.id, username: user.username }
  })
}
