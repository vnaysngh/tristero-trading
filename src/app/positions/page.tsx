import { Header } from "@/components/Header";
import { PositionsTable } from "@/components/PositionsTable";

export const metadata = {
  title: "Positions - Tristero Trading Interface",
  description: "View your open trading positions"
};

export default function PositionsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Open Positions
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your active trading positions
            </p>
          </div>

          <PositionsTable />
        </div>
      </main>
    </div>
  );
}
