import { prisma } from '@/lib/prisma'
import { getIdFromUrl } from '@/lib/helpers'
import { NextRequest, NextResponse } from 'next/server'

async function fetchWithRetry(url: string, options: RequestInit, retries = 2): Promise<Response> {
  try {
    const response = await fetch(url, options)
    if (!response.ok && retries > 0) {
      return fetchWithRetry(url, options, retries - 1)
    }
    return response
  } catch (error) {
    if (retries > 0) {
      return fetchWithRetry(url, options, retries - 1)
    }
    throw error
  }
}

export async function GET(req: NextRequest) {
  try {
    const subApiId = getIdFromUrl(req)
    if (!subApiId) {
      return NextResponse.json({ error: 'ID inválido o no proporcionado' }, { status: 400 })
    }

    const subApi = await prisma.businessSubApi.findUnique({
      where: { id: subApiId },
      include: {
        apiChat: {
          select: {
            publicApiKey: true,
            business: {
              select: { name: true },
            },
          },
        },
        api: {
          select: { baseUrl: true },
        },
      },
    })

    if (!subApi) {
      return NextResponse.json({ error: 'Sub API no encontrada' }, { status: 404 })
    }

    const baseUrl = subApi.api.baseUrl
    const businessLeadId = subApi.externalId
    const businessLeadToken = subApi.apiChat.publicApiKey
    const businessName = subApi.apiChat.business.name

    if (!baseUrl || !businessLeadId || !businessLeadToken) {
      return NextResponse.json({ error: 'Faltan datos para la consulta' }, { status: 400 })
    }

    const targetUrl = `${baseUrl}api/users`

    let response: Response
    try {
      response = await fetchWithRetry(targetUrl, {
        method: 'GET',
        headers: {
          'businesslead-id': businessLeadId,
          'businesslead-token': businessLeadToken,
        },
      }, 2)
    } catch (err) {
      return NextResponse.json({ error: 'Error al contactar la API externa', details: err }, { status: 502 })
    }

    const contentType = response.headers.get('content-type') || ''

    if (!response.ok) {
      const errorBody = contentType.includes('application/json')
        ? await response.json()
        : await response.text()

      return NextResponse.json(
        { error: 'Error al consultar los usuarios', details: errorBody },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json({ users: data.users, businessName })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const subApiId = getIdFromUrl(req)
    console.log('🟠 Paso 1: subApiId extraído de URL:', subApiId)

    if (!subApiId) {
      console.error('🔴 ID no proporcionado')
      return NextResponse.json({ error: 'ID inválido o no proporcionado' }, { status: 400 })
    }

    const body = await req.json()
    const { username, role } = body
    console.log('🟠 Paso 2: Datos recibidos del frontend →', body)

    if (!username || !role) {
      console.error('🔴 Falta username o role')
      return NextResponse.json({ error: 'Faltan datos para crear el usuario' }, { status: 400 })
    }

    const subApi = await prisma.businessSubApi.findUnique({
      where: { id: subApiId },
      include: {
        apiChat: {
          select: {
            publicApiKey: true,
            business: {
              select: { name: true },
            },
          },
        },
        api: {
          select: { baseUrl: true },
        },
      },
    })

    console.log('🟢 Paso 3: ¿subApi encontrado?', !!subApi)

    if (!subApi) {
      return NextResponse.json({ error: 'Sub API no encontrada' }, { status: 404 })
    }

    const baseUrl = subApi.api.baseUrl
    const businessLeadId = subApi.externalId
    const businessLeadToken = subApi.apiChat.publicApiKey

    console.log('🟠 Paso 3.1: baseUrl:', baseUrl)
    console.log('🟠 Paso 3.2: businessLeadId:', businessLeadId)
    console.log('🟠 Paso 3.3: businessLeadToken:', businessLeadToken)

    if (!baseUrl || !businessLeadId || !businessLeadToken) {
      console.error('🔴 Faltan datos clave para llamar la API externa')
      return NextResponse.json({ error: 'Faltan datos para la consulta' }, { status: 400 })
    }

    const businessIdInt = parseInt(businessLeadId)
    if (isNaN(businessIdInt)) {
      console.error('🔴 businessLeadId no es un número válido')
      return NextResponse.json({ error: 'ID de negocio inválido' }, { status: 400 })
    }

    const targetUrl = `${baseUrl}api/users`
    const payload = {
      username,
      roleName: role,
      businessId: businessIdInt,
      token: businessLeadToken,
    }

    console.log('🟠 Paso 4: URL destino para POST →', targetUrl)
    console.log('🟠 Paso 4.1: Payload que se enviará →', JSON.stringify(payload, null, 2))

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'businesslead-id': businessLeadId,
        'businesslead-token': businessLeadToken,
      },
      body: JSON.stringify(payload),
    })

    console.log('🟢 Paso 5: status de respuesta externa:', response.status)

    const contentType = response.headers.get('content-type') || ''
    console.log('🟢 Paso 6: Content-Type de respuesta externa:', contentType)

    const data = contentType.includes('application/json')
      ? await response.json()
      : await response.text()

    if (!response.ok) {
      console.error('🔴 Error creando usuario en API externa:', data)
      return NextResponse.json(
        { error: 'Error al crear usuario externo', details: data },
        { status: response.status }
      )
    }

    console.log('✅ Usuario creado exitosamente en API externa:', data)

    return NextResponse.json({
      message: 'Usuario creado exitosamente',
      password: data.password,
      userId: data.userId
    })

  } catch (error) {
    console.error('❌ Error en POST de usuarios:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}



