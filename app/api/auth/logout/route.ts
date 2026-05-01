import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

// POST /api/auth/logout
export async function POST() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  const response = NextResponse.json({ message: 'Logged out successfully' })
  response.headers.set('Set-Cookie', 'token=; Path=/; HttpOnly; Max-Age=0')
  return response
}
