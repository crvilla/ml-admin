// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const PUBLIC_PATHS = ['/', '/login', '/api/auth/login']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next()
  }

  const token = request.cookies.get('token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!)
    await jwtVerify(token, secret)

    return NextResponse.next()
  } catch (error) {
    console.warn('🔐 Token inválido o expirado:', error)
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
}
