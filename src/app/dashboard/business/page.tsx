'use client'

import { useEffect, useState } from 'react'
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
} from '@heroui/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Business = {
  id: string
  name: string
  status: string
  createdAt: string
}

export default function BusinessPage() {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const res = await fetch('/api/business')
        const data = await res.json()
        setBusinesses(data)
      } catch (error) {
        console.error('Error fetching businesses:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBusinesses()
  }, [])

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Clientes registrados</h1>
        <Link
          href="/dashboard/business/create"
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
        >
          Crear nuevo cliente
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-600">Cargando...</p>
      ) : businesses.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-20 space-y-4">
          <p className="text-gray-700 italic text-lg">
            No hay clientes registrados aún.
          </p>
          <Link
            href="/dashboard/business/create"
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
          >
            Crear nuevo cliente
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-4">
          {businesses.map((b) => (
            <Card
              key={b.id}
              className="shadow-md p-4 flex flex-col justify-between h-full"
            >
              <CardHeader className="flex flex-col items-start gap-1">
                <p className="text-lg font-semibold text-gray-900">{b.name}</p>
                <p className="text-sm text-gray-500 capitalize">{b.status.toLowerCase()}</p>
              </CardHeader>

              <CardBody className="text-sm text-gray-600 pt-2">
                Cliente desde el{' '}
                <span className="font-medium">
                  {new Date(b.createdAt).toLocaleDateString()}
                </span>
              </CardBody>

              <CardFooter className="pt-4">
                <Button
                  color="warning"
                  variant="solid"
                  size="sm"
                  onClick={() => router.push(`/dashboard/business/${b.slug}`)}
                  className="w-full"
                >
                  Más info
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
