import { ErrorBoundary } from "@/components/ErrorBoundary";
import PortfolioPage from "@/components/Portfolio/Portfolio";

export const metadata = {
  title: "Portfolio - Tristero Trading Interface",
  description: "View your portfolio"
};

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <ErrorBoundary>
            <PortfolioPage />
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
}
