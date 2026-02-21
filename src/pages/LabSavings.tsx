import { useSimulation } from '@/contexts/SimulationContext';
import { IndianRupee } from 'lucide-react';

const LabSavings = () => {
  const { labs, actionLog, dailySavings } = useSimulation();

  // Calculate per-lab savings from action log
  const labSavingsMap: Record<string, number> = {};
  labs.forEach(l => { labSavingsMap[l.name] = 0; });
  actionLog.forEach(entry => {
    labSavingsMap[entry.lab] = (labSavingsMap[entry.lab] || 0) + entry.savingsPerHour * 2;
  });
  // Add some base savings for visual appeal
  labs.forEach(l => {
    labSavingsMap[l.name] += Math.floor(Math.random() * 500) + 200;
  });

  const sortedLabs = Object.entries(labSavingsMap).sort((a, b) => b[1] - a[1]);
  const maxVal = Math.max(...sortedLabs.map(([, v]) => v), 1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Lab Savings Breakdown</h1>
        <p className="text-muted-foreground text-sm mt-1">Comparative cost savings per lab</p>
      </div>

      <div className="bg-card rounded-xl border border-border p-6 space-y-4">
        {sortedLabs.map(([lab, amount], i) => (
          <div key={lab} className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-foreground font-medium">{lab}</span>
              <span className="font-mono text-primary">₹{amount.toLocaleString('en-IN')}</span>
            </div>
            <div className="h-6 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${(amount / maxVal) * 100}%`,
                  background: i === 0
                    ? 'linear-gradient(90deg, hsl(160 84% 39%), hsl(185 80% 50%))'
                    : `hsl(160 84% 39% / ${0.7 - i * 0.05})`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="bg-card rounded-xl border border-primary/30 p-6 glow-box-emerald text-center">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total Lab Savings</p>
        <p className="text-3xl font-black font-mono text-primary glow-emerald">
          ₹{sortedLabs.reduce((s, [, v]) => s + v, 0).toLocaleString('en-IN')}
        </p>
      </div>
    </div>
  );
};

export default LabSavings;
