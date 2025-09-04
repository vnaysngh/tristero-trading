import { TradeHistory } from "@/components/TradeHistory";

export default function TradesPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <TradeHistory />
        </div>
      </main>
    </div>
  );
}
