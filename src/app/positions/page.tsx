import Positions from "@/components/Positions";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export const metadata = {
  title: "Positions - Tristero Trading Interface",
  description: "View your open trading positions"
};

export default function PositionsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <ErrorBoundary>
            <Positions />
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
}
