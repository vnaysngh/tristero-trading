import { notFound } from "next/navigation";
import { MarketDetails } from "@/components/MarketDetails";

interface MarketPageProps {
  params: {
    symbol: string;
  };
}

export default async function MarketPage({ params }: MarketPageProps) {
  const { symbol } = await params;

  if (!symbol) {
    notFound();
  }

  return <MarketDetails symbol={symbol} />;
}

export async function generateMetadata({ params }: MarketPageProps) {
  const { symbol } = await params;

  return {
    title: `${symbol} - Market Details | Tristero Trading`,
    description: `View detailed market information, price charts, and trading data for ${symbol}`
  };
}
