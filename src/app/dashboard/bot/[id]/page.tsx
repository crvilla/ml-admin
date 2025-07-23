import BotDetailPageLayout from "./components/BotDetailPageLayout";
interface BotDetailPageProps {
  params: {
    id: string
  }
}

export default function BotDetailPage({ params }: BotDetailPageProps) {
  return <BotDetailPageLayout botId={params.id} />
}
