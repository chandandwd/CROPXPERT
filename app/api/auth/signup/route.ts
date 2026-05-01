import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

// POST /api/auth/signup
export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email and password are required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    })

    if (error) {
      throw error
    }

    return NextResponse.json(
      { 
        message: 'Account created successfully', 
        user: {
          id: data.user?.id,
          email: data.user?.email,
          name: name
        } 
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Signup error:', error)
    return NextResponse.json({ error: error.message || 'Failed to create account' }, { status: 500 })
  }
}
