import BackToBusinessButton from './components/BackToBusinessButton'
import BusinessApiChatConfigCard from './components/BusinessApiChatConfigCard'
import BusinessSubApiConfigList from './components/BusinessSubApiConfigList'

export default function ApiChatPage({ params }: { params: { id: string } }) {
  const { id } = params

  return (
    <div className="p-6">
      <BackToBusinessButton businessApiId={id} />
      <BusinessApiChatConfigCard businessApiId={id} />
       <BusinessSubApiConfigList businessApiId={id} />
    </div>
  )
}
