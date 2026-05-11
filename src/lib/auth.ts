import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

const ADMIN_COOKIE = 'admin_session'

export function setAdminCookie() {
  cookies().set(ADMIN_COOKIE, 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  })
}

export function clearAdminCookie() {
  cookies().delete(ADMIN_COOKIE)
}

export function isAdminAuthenticated(): boolean {
  const cookieStore = cookies()
  return cookieStore.get(ADMIN_COOKIE)?.value === 'authenticated'
}

export function isAdminFromRequest(req: NextRequest): boolean {
  return req.cookies.get(ADMIN_COOKIE)?.value === 'authenticated'
}
