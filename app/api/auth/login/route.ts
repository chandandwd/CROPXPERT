import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// POST /api/auth/login
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }

    const safeUser = {
      id: data.user?.id,
      email: data.user?.email,
      name: data.user?.user_metadata?.full_name,
    }

    return NextResponse.json({ message: 'Login successful', user: safeUser })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
