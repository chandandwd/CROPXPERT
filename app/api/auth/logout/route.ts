import { NextResponse } from 'next/server'
import { buildClearCookie } from '@/lib/auth'

// POST /api/auth/logout
export async function POST() {
  const response = NextResponse.json({ message: 'Logged out successfully' })
  response.headers.set('Set-Cookie', buildClearCookie())
  return response
}
