import { Leaf, Zap, Server, IndianRupee, TreePine } from 'lucide-react';
import { useSimulation } from '@/contexts/SimulationContext';

const ResourceImpact = () => {
  const { totalSavingsMonth, labs } = useSimulation();
  const totalShutdown = labs.flatMap(l => l.pcs).filter(p => p.status === 'Auto-Shutdown').length;

  // Mock environmental calculations
  const kWhSaved = totalShutdown * 0.3 * 24 * 30; // ~0.3kWh per idle PC per hour
  const co2Saved = kWhSaved * 0.82; // India grid emission factor kg CO2/kWh
  const treeEquivalent = Math.floor(co2Saved / 21); // ~21kg CO2 per tree per year

  const impacts = [
    { icon: IndianRupee, label: 'Monthly Cost Savings', value: `₹${totalSavingsMonth.toLocaleString('en-IN')}`, color: 'text-primary', glow: 'glow-box-emerald' },
    { icon: Zap, label: 'Energy Saved (kWh)', value: `${kWhSaved.toFixed(0)} kWh`, color: 'text-neon-amber', glow: 'glow-box-amber' },
    { icon: Leaf, label: 'CO₂ Reduced', value: `${co2Saved.toFixed(1)} kg`, color: 'text-neon-cyan', glow: 'glow-box-cyan' },
    { icon: TreePine, label: 'Tree Equivalent', value: `${treeEquivalent} trees/yr`, color: 'text-primary', glow: 'glow-box-emerald' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Prevents Resource Waste</h1>
        <p className="text-muted-foreground text-sm mt-1">Environmental and financial impact of Idle Guard</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {impacts.map(({ icon: Icon, label, value, color, glow }) => (
          <div key={label} className={`bg-card rounded-xl border border-border p-6 ${glow}`}>
            <Icon className={`w-8 h-8 ${color} mb-3`} />
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
            <p className={`text-2xl font-bold font-mono ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-xl border border-border p-6 space-y-3">
        <h2 className="text-lg font-semibold text-foreground">How Idle Guard Helps</h2>
        <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
          <p>• <span className="text-foreground font-medium">Zero Zombie Infrastructure</span> — AI continuously monitors all {labs.flatMap(l => l.pcs).length} systems across {labs.length} labs</p>
          <p>• <span className="text-foreground font-medium">Predictive Scheduling</span> — ML models learn usage patterns and pre-emptively power down resources</p>
          <p>• <span className="text-foreground font-medium">Carbon Footprint Reduction</span> — Every idle system shut down directly reduces campus energy consumption</p>
          <p>• <span className="text-foreground font-medium">Budget Reallocation</span> — Savings from power reduction can fund new lab equipment and research</p>
        </div>
      </div>
    </div>
  );
};

export default ResourceImpact;
