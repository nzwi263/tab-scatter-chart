import { ChartCard, ScatterChart } from './components';
import type { ChartStatistics } from './components/ScatterChart';

function App() {
  // Sample data for the scatter chart
  const scatterData: ChartStatistics = {
    xAxis: { q1: 80102, median: 139250, q3: 139250, userValue: 139250 },
    yAxis: { q1: 18.57, median: 19.26, q3: 19.26, userValue: 19.26 },
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8 flex flex-col items-center justify-center">
      <div className="max-w-[880px] w-full space-y-8">
        {/* Scatter Chart Example */}
        <ChartCard
          width={800}
          height={500}
          title="Revenue Growth vs MRR"
          description="Compare your growth rate and revenue scale against peer benchmarks"
          badgeType="live"
          badgeText="Live"
        >
          <ScatterChart
            width={700}
            height={360}
            statistics={scatterData}
            xAxisLabel="MRR (USD)"
            yAxisLabel="Revenue Growth Rate (%)"
          />
        </ChartCard>

        {/* Example 2: Top badge */}
        <ChartCard
          width={800}
          height={400}
          title="Customer Acquisition Cost"
          description="Analyze your CAC efficiency relative to industry standards"
          badgeType="top"
          badgeText="Top 10%"
        />

        {/* Example 3: Bottom badge */}
        <ChartCard
          width={800}
          height={400}
          title="Net Revenue Retention"
          description="Track your NRR performance across different customer segments"
          badgeType="bottom"
          badgeText="Bottom 25%"
        />
      </div>
    </div>
  );
}

export default App;
