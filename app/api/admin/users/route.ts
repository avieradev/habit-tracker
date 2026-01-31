import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'

// Simple admin endpoint - in production, add proper admin auth
export async function POST(request: Request) {
  const { username, password } = await request.json()

  if (!username || !password) {
    return NextResponse.json({ error: 'Missing username or password' }, { status: 400 })
  }

  try {
    const hashedPassword = await hashPassword(password)
    
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword
      }
    })

    return NextResponse.json({ 
      success: true,
      user: { id: user.id, username: user.username }
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Username already exists' }, { status: 409 })
  }
}
