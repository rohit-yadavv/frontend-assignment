import { mockStockData } from "@/lib/temp-data";
import { StockHeader } from "./_components/stock-header";
import CustomMetrics from "./_components/custom-metrics";
import { ScoreCard } from "./_components/score-card";
import StockChart from "./_components/price-chart";

export default function Home() {
  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      <div className="flex flex-col size-full space-y-6">
        <StockHeader data={mockStockData} />

        <CustomMetrics />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-full">
          <StockChart />
        </div>
        <div className="lg:col-span-1">
          <ScoreCard />
        </div>
      </div>
    </div>
  );
}
