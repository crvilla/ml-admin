import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const roles = ['admin', 'comercial']

  for (const roleName of roles) {
    const exists = await prisma.role.findUnique({
      where: { name: roleName },
    })

    if (exists) {
      console.log(`⚠️ Rol "${roleName}" ya existe con id ${exists.id}`)
    } else {
      const newRole = await prisma.role.create({
        data: { name: roleName },
      })
      console.log(`✅ Rol "${roleName}" creado con id ${newRole.id}`)
    }
  }

  const apiCatalogEntries = [
    { name: 'leads_api', type: 'PROD', baseUrl: 'https://ml-dashboard-client-six.vercel.app/' },
    { name: 'chats_api', type: 'PROD', baseUrl: 'https://ml-business-api-seven.vercel.app/' },
    { name: 'leads_api', type: 'DEV', baseUrl: 'https://ml-dashboard-client.vercel.app/' },
    { name: 'chats_api', type: 'DEV', baseUrl: 'https://ml-business-api.vercel.app/' },
  ]

  for (const api of apiCatalogEntries) {
    const exists = await prisma.apiIntegrationCatalog.findFirst({
      where: {
        name: api.name,
        type: api.type,
      },
    })

    if (exists) {
      console.log(`⚠️ API "${api.name}" (${api.type}) ya existe`)
    } else {
      const newApi = await prisma.apiIntegrationCatalog.create({
        data: api,
      })
      console.log(`✅ API "${newApi.name}" (${newApi.type}) creada`)
    }
  }

  // ✅ SEED DE VERTICALES
  const verticals = [
    { name: 'Autos', slug: 'autos', label: 'Compra y venta de vehículos' },
    { name: 'Salud', slug: 'salud', label: 'Profesionales de salud' },
    { name: 'Jardines Infantiles', slug: 'daycares', label: 'Sedes educativas y cuidado infantil' },
    { name: 'Ferretería', slug: 'ferreteria', label: 'Ferretería y materiales de construcción' },
    { name: 'Pinturas', slug: 'pinturas', label: 'Venta de pinturas y accesorios' },
    { name: 'Veterinaria', slug: 'veterinaria', label: 'Atención y productos para mascotas' },
    { name: 'Ropa', slug: 'ropa', label: 'Tiendas de ropa y accesorios' },
    { name: 'Comida', slug: 'comida', label: 'Venta de alimentos y bebidas' },
    { name: 'Inmobiliaria', slug: 'inmobiliaria', label: 'Arriendo y venta de inmuebles' },
    { name: 'Educación', slug: 'cursos', label: 'Venta de cursos, clases o talleres' },
    { name: 'Peluquería', slug: 'peluqueria', label: 'Servicios de belleza y cuidado personal' },
  ]

  for (const vertical of verticals) {
    const exists = await prisma.vertical.findUnique({
      where: { slug: vertical.slug },
    })

    if (exists) {
      console.log(`⚠️ Vertical "${vertical.name}" (slug: ${vertical.slug}) ya existe`)
    } else {
      const newVertical = await prisma.vertical.create({
        data: vertical,
      })
      console.log(`✅ Vertical "${newVertical.name}" creada con slug "${newVertical.slug}"`)
    }
  }
}

const verticalVariablesBySlug = {
  autos: [
    { name: 'Marca del vehículo', slug: 'marca', label: '¿Qué marca buscas?', type: 'STRING' },
    { name: 'Modelo', slug: 'modelo', label: '¿Qué modelo te interesa?', type: 'STRING' },
    { name: 'Año', slug: 'anio', label: '¿De qué año?', type: 'NUMBER' },
    { name: 'Precio', slug: 'precio', label: '¿Cuál es tu presupuesto?', type: 'NUMBER' },
    { name: 'Color', slug: 'color', label: '¿Qué color prefieres?', type: 'STRING' },
    { name: 'Tipo', slug: 'tipo', label: '¿Qué tipo de carro?', type: 'STRING' },
    { name: 'Condición', slug: 'condicion', label: '¿Nuevo o usado?', type: 'STRING' },
  ],
  salud: [
    { name: 'Especialidad médica', slug: 'especialidad', label: '¿Qué especialidad necesitas?', type: 'STRING' },
    { name: 'Urgencia', slug: 'urgencia', label: '¿Es una urgencia?', type: 'BOOLEAN' },
  ],
  daycares: [
    { name: 'Edad del niño', slug: 'edad', label: '¿Qué edad tiene el niño o niña?', type: 'NUMBER' },
    { name: 'Horario', slug: 'horario', label: '¿Qué horario necesitas?', type: 'STRING' },
  ],
  ferreteria: [
    { name: 'Producto', slug: 'producto', label: '¿Qué producto buscas?', type: 'STRING' },
    { name: 'Cantidad', slug: 'cantidad', label: '¿Cuántas unidades necesitas?', type: 'NUMBER' },
  ],
  pinturas: [
    { name: 'Color de pintura', slug: 'color', label: '¿Qué color necesitas?', type: 'STRING' },
    { name: 'Tipo de superficie', slug: 'superficie', label: '¿Para qué tipo de superficie es?', type: 'STRING' },
  ],
  veterinaria: [
    { name: 'Tipo de mascota', slug: 'mascota', label: '¿Qué tipo de mascota tienes?', type: 'STRING' },
    { name: 'Servicio requerido', slug: 'servicio', label: '¿Qué servicio necesitas?', type: 'STRING' },
  ],
  ropa: [
    { name: 'Talla', slug: 'talla', label: '¿Qué talla usas?', type: 'STRING' },
    { name: 'Color', slug: 'color', label: '¿Qué color prefieres?', type: 'STRING' },
  ],
  comida: [
    { name: 'Producto alimenticio', slug: 'producto', label: '¿Qué producto necesitas?', type: 'STRING' },
    { name: 'Cantidad', slug: 'cantidad', label: '¿Cuánto necesitas?', type: 'NUMBER' },
  ],
  inmobiliaria: [
    { name: 'Tipo de inmueble', slug: 'tipo', label: '¿Qué tipo de propiedad buscas?', type: 'STRING' },
    { name: 'Ciudad', slug: 'ciudad', label: '¿En qué ciudad?', type: 'STRING' },
    { name: 'Precio máximo', slug: 'precio_max', label: '¿Cuál es tu presupuesto?', type: 'NUMBER' },
  ],
  cursos: [
    { name: 'Tema', slug: 'tema', label: '¿Qué tema quieres aprender?', type: 'STRING' },
    { name: 'Modalidad', slug: 'modalidad', label: '¿Online o presencial?', type: 'STRING' },
  ],
  peluqueria: [
    { name: 'Servicio', slug: 'servicio', label: '¿Qué servicio deseas?', type: 'STRING' },
    { name: 'Fecha deseada', slug: 'fecha', label: '¿Para cuándo deseas agendar?', type: 'DATE' },
  ],
}

for (const [slug, variables] of Object.entries(verticalVariablesBySlug)) {
  const vertical = await prisma.vertical.findUnique({
    where: { slug },
  })

  if (!vertical) {
    console.warn(`⚠️ Vertical con slug "${slug}" no encontrada, omitiendo variables.`)
    continue
  }

  for (const variable of variables) {
    const exists = await prisma.verticalVariable.findFirst({
      where: {
        verticalId: vertical.id,
        slug: variable.slug,
      },
    })

    if (exists) {
      console.log(`⚠️ Variable "${variable.slug}" ya existe en vertical "${slug}"`)
    } else {
      await prisma.verticalVariable.create({
        data: {
          ...variable,
          verticalId: vertical.id,
          type: variable.type, // Se mantiene como string porque es un enum
        },
      })
      console.log(`✅ Variable "${variable.slug}" creada en vertical "${slug}"`)
    }
  }
}

main()
  .catch((e) => {
    console.error('❌ Error en el seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
