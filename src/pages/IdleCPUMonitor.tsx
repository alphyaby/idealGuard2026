import { useSimulation } from '@/contexts/SimulationContext';
import { AlertTriangle, Cpu } from 'lucide-react';

const IdleCPUMonitor = () => {
  const { labs } = useSimulation();
  const idlePCs = labs.flatMap(l => l.pcs).filter(p => p.status === 'Idle');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Idle CPU Monitor</h1>
        <p className="text-muted-foreground text-sm mt-1">Systems flagged below idle threshold — awaiting AI action</p>
      </div>

      <div className="bg-card rounded-xl border border-border glow-box-amber">
        <div className="flex items-center gap-2 px-5 py-3 border-b border-border">
          <AlertTriangle className="w-4 h-4 text-neon-amber" />
          <span className="text-sm font-medium text-neon-amber">{idlePCs.length} systems flagged</span>
        </div>

        {idlePCs.length === 0 ? (
          <p className="p-8 text-center text-muted-foreground text-sm">All systems above idle threshold ✓</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground uppercase tracking-wider">
                  <th className="px-5 py-3">System</th>
                  <th className="px-5 py-3">Lab</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">CPU</th>
                  <th className="px-5 py-3">Network</th>
                  <th className="px-5 py-3">Idle Ticks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {idlePCs.map(pc => (
                  <tr key={pc.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-5 py-3 font-mono text-foreground">{pc.name}</td>
                    <td className="px-5 py-3 text-muted-foreground">{pc.lab}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${pc.type === 'server' ? 'bg-neon-cyan/10 text-neon-cyan' : 'bg-secondary text-secondary-foreground'}`}>
                        {pc.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-mono text-neon-amber">{pc.cpu.toFixed(1)}%</td>
                    <td className="px-5 py-3 font-mono text-muted-foreground">{pc.networkKbps.toFixed(0)} kbps</td>
                    <td className="px-5 py-3 font-mono text-neon-rose">{pc.idleTicks}/{pc.type === 'server' ? 5 : 3}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default IdleCPUMonitor;
