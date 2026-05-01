import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET!
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

if (!JWT_SECRET) {
  throw new Error('Please define the JWT_SECRET environment variable in .env.local')
}

export interface JwtPayload {
  userId: string
  email: string
  role: string
}

/** Sign a JWT token */
export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions)
}

/** Verify a JWT token — returns payload or null */
export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload
  } catch {
    return null
  }
}

/** Extract and verify the token from the Authorization header or cookie */
export async function getAuthUser(request: Request): Promise<JwtPayload | null> {
  // 1. Check Authorization: Bearer <token>
  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7)
    return verifyToken(token)
  }

  // 2. Check httpOnly cookie (server-side)
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('cropxpert_token')?.value
    if (token) return verifyToken(token)
  } catch (error) {
    // cookies() only works in Server Components / Route Handlers
  }

  return null
}

/** Build a Set-Cookie header string for the JWT */
export function buildTokenCookie(token: string): string {
  const maxAge = 7 * 24 * 60 * 60 // 7 days in seconds
  return `cropxpert_token=${token}; HttpOnly; Path=/; Max-Age=${maxAge}; SameSite=Strict${
    process.env.NODE_ENV === 'production' ? '; Secure' : ''
  }`
}

/** Clear the auth cookie */
export function buildClearCookie(): string {
  return `cropxpert_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict`
}
