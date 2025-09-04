import { Header } from "@/components/Header";
import { MarketList } from "@/components/MarketList";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section>
              <MarketList />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
