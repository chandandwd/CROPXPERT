import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

// GET /api/auth/me  — returns the logged-in user profile
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name,
        ...user.user_metadata
      }
    })
  } catch (error) {
    console.error('Get profile error:', error)
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}

// PATCH /api/auth/me  — update profile fields
export async function PATCH(request: Request) {
  try {
    const updates = await request.json()
    const { data, error } = await supabase.auth.updateUser({
      data: updates
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ 
      user: {
        id: data.user?.id,
        email: data.user?.email,
        ...data.user?.user_metadata
      }
    })
  } catch (error) {
    console.error('Update profile error:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
