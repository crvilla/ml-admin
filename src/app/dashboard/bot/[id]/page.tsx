import BotDetailPageLayout from "./components/BotDetailPageLayout";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function BotDetailPage({ params }: PageProps) {
  return <BotDetailPageLayout botId={params.id} />;
}
