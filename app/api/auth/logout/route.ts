import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// POST /api/auth/logout
export async function POST() {
  await supabase.auth.signOut()
  const response = NextResponse.json({ message: 'Logged out successfully' })
  response.headers.set('Set-Cookie', 'token=; Path=/; HttpOnly; Max-Age=0')
  return response
}
