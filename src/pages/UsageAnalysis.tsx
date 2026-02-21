import { useSimulation } from '@/contexts/SimulationContext';
import { TrendingUp, Activity } from 'lucide-react';

const UsageAnalysis = () => {
  const { labs } = useSimulation();

  // Pick a few labs and generate mock trend data
  const trendLabs = labs.slice(0, 4);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Usage Pattern Analysis</h1>
        <p className="text-muted-foreground text-sm mt-1">CPU vs. Time trend analysis for AI pattern learning</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {trendLabs.map(lab => {
          // Create mini sparkline from current PC data
          const avgCpu = lab.pcs.reduce((s, p) => s + p.cpu, 0) / lab.pcs.length;
          const bars = lab.pcs.slice(0, 12).map(p => p.cpu);

          return (
            <div key={lab.name} className="bg-card rounded-xl border border-border p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-semibold text-foreground">{lab.name}</p>
                  <p className="text-xs text-muted-foreground">Avg CPU: {avgCpu.toFixed(1)}%</p>
                </div>
                <Activity className={`w-5 h-5 ${avgCpu > 50 ? 'text-primary' : avgCpu > 20 ? 'text-neon-amber' : 'text-neon-rose'}`} />
              </div>

              {/* Mini bar chart */}
              <div className="flex items-end gap-1 h-20">
                {bars.map((val, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t transition-all duration-500"
                    style={{
                      height: `${Math.max(val, 2)}%`,
                      backgroundColor: val < 10
                        ? 'hsl(350 80% 55% / 0.7)'
                        : val < 30
                        ? 'hsl(38 92% 50% / 0.7)'
                        : 'hsl(160 84% 39% / 0.7)',
                    }}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-1 text-[10px] text-muted-foreground font-mono">
                <span>Systems</span>
                <span>CPU %</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pattern Summary */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="text-lg font-semibold mb-3 text-foreground flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          AI Pattern Insights
        </h2>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>• <span className="text-foreground">Programming Lab 1</span> shows consistent idle periods between <span className="text-primary font-mono">18:00–08:00</span></p>
          <p>• <span className="text-foreground">CSE Lab</span> server has weekend utilization below <span className="text-neon-amber font-mono">3%</span> — candidate for weekend auto-shutdown</p>
          <p>• <span className="text-foreground">Seminar Hall</span> PCs are idle <span className="text-neon-rose font-mono">87%</span> of monitored time — recommend reduced provisioning</p>
          <p>• AI confidence for predictive scheduling: <span className="text-primary font-mono font-semibold">94.2%</span></p>
        </div>
      </div>
    </div>
  );
};

export default UsageAnalysis;
