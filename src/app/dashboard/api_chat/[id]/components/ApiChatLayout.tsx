'use client'

import { useParams } from 'next/navigation'
import BackToBusinessButton from './BackToBusinessButton'
import BusinessApiChatConfigCard from './BusinessApiChatConfigCard'
import BusinessSubApiConfigList from './BusinessSubApiConfigList'

export default function ApiChatLayout() {
  const params = useParams()
  const businessApiId = params?.id as string

  if (!businessApiId) {
    return <div className="p-6 text-red-500">No se encontró el ID de la API</div>
  }

  return (
    <div className="p-6">
      <BackToBusinessButton businessApiId={businessApiId} />
      <BusinessApiChatConfigCard businessApiId={businessApiId} />
      <BusinessSubApiConfigList businessApiId={businessApiId} />
    </div>
  )
}
