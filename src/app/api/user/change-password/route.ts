import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'
import { cookies } from 'next/headers'
import { jwtVerify, SignJWT } from 'jose'

export type JWTPayloadCustom = {
  id: string
  user_name: string
  role: string
  changePassword: boolean
}

export async function POST(request: Request) {
  try {

    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET!)
    const { payload } = await jwtVerify(token, secret) as { payload: JWTPayloadCustom }

    const body = await request.json()
    const { password } = body

    if (!password || password.length < 6) {
      return NextResponse.json({ error: 'Contraseña inválida (mínimo 6 caracteres)' }, { status: 400 })
    }

    const hashed = await bcrypt.hash(password, 10)

    await prisma.user.update({
      where: { id: payload.id },
      data: {
        password: hashed,
        changePassword: false
      }
    })

    const newToken = await new SignJWT({
      id: payload.id,
      user_name: payload.user_name,
      role: payload.role,
      changePassword: false
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(secret)

    const response = NextResponse.json({ message: 'Contraseña actualizada' })

    response.cookies.set({
      name: 'token',
      value: newToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 días
    })

    return response
  } catch (error) {
    console.error('❌ Error en change-password:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
