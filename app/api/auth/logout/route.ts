import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json({ success: true }, {
    headers: {
      'Set-Cookie': 'token=; Path=/; HttpOnly; Max-Age=0; SameSite=Strict'
    }
  })
}
