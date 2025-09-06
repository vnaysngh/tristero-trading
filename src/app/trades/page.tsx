import { ErrorBoundary } from "@/components/ErrorBoundary";
import { TradeHistory } from "@/components/TradeHistory/TradeHistory";

export const metadata = {
  title: "Trade History - Tristero Trading Interface",
  description: "View your trade history"
};

export default function TradesPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <ErrorBoundary>
            <TradeHistory />
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
}
