import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'
import { signToken, buildTokenCookie } from '@/lib/auth'

// POST /api/auth/signup
export async function POST(request: Request) {
  try {
    const { name, email, password, role, phone, location, farmSize, primaryCrops } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    if (!process.env.JWT_SECRET) {
      console.error('❌ Missing JWT_SECRET environment variable!')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    await connectDB()

    // Check if user already exists
    const existing = await User.findOne({ email: email.toLowerCase() })
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
    }

    // Create user (password hashed in pre-save hook)
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'farmer',
      phone,
      location,
      farmSize,
      primaryCrops,
    })

    const token = signToken({ userId: user._id.toString(), email: user.email, role: user.role })

    const response = NextResponse.json(
      { message: 'Account created successfully', user },
      { status: 201 }
    )
    response.headers.set('Set-Cookie', buildTokenCookie(token))
    return response
  } catch (error: any) {
    console.error('Signup error:', error)
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 })
  }
}
