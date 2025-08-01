'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from '@heroui/react'
import { RawUser, User } from '@/app/dashboard/api_lead/types/types'
import { UsersRound, RefreshCw } from 'lucide-react'

export default function ApiLeadUsersLayout() {
  const params = useParams()
  const apiLeadId = params?.api_lead_id as string

  const [users, setUsers] = useState<User[]>([])
  const [businessName, setBusinessName] = useState<string>('Cargando...')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!apiLeadId) return

    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/business/api_integration/sub_api/users/api_lead_id/${apiLeadId}`)
        const data = await res.json()

        if (res.ok && data.users) {
          setUsers(
            (data.users as RawUser[]).map((u) => ({
              id: u.id,
              username: u.username,
              role: u.role.name,
            }))
          )
          setBusinessName(data.businessName || 'Negocio desconocido')
        } else {
          console.warn('❌ No se pudieron cargar los usuarios:', data)
        }
      } catch (error) {
        console.error('❌ Error al obtener usuarios:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [apiLeadId])

  const columns = [
    { key: 'username', label: 'Usuario' },
    { key: 'role', label: 'Rol' },
    { key: 'action', label: 'Acción' },
  ]

  function OrangeSpinner() {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
      </div>
    )
  }

  return loading ? (
    <OrangeSpinner />
  ) : (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-800">
          Usuarios de <span className="text-orange-600">{businessName}</span>
        </h1>
        <Link
          href={`/dashboard/api_lead/users/id/${apiLeadId}/create`}
          className="px-4 py-2 text-sm font-medium bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
        >
          Registrar nuevo usuario
        </Link>
      </div>

      {users.length > 0 ? (
        <Table aria-label="Usuarios del negocio">
          <TableHeader>
            {columns.map((column) => (
              <TableColumn key={column.key} className="text-center">
                {column.label}
              </TableColumn>
            ))}
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                {(columnKey) => {
                  if (columnKey === 'action') {
                    return (
                      <TableCell className="text-center">
                        <div className="flex justify-center">
                          <button
                            disabled
                            className="flex items-center gap-1 text-sm px-3 py-1 bg-gray-100 text-gray-500 rounded-md cursor-not-allowed"
                          >
                            <RefreshCw className="w-4 h-4" />
                            Refrescar contraseña
                          </button>
                        </div>
                      </TableCell>
                    )
                  }
                  return (
                    <TableCell className="text-center">
                      {getKeyValue(user, columnKey)}
                    </TableCell>
                  )
                }}
              </TableRow>
            ))}
          </TableBody>
        </Table>

      ) : (
        <div className="flex flex-col items-center justify-center text-gray-500 py-10 space-y-3">
          <UsersRound className="w-10 h-10 text-orange-500" />
          <p className="text-base font-medium">No hay usuarios registrados aún</p>
          <p className="text-sm text-gray-400">Cuando se cree uno, aparecerá aquí automáticamente.</p>
        </div>
      )}
    </div>
  )
}
