import { useSimulation } from '@/contexts/SimulationContext';
import { Power, Server, Monitor } from 'lucide-react';

const LabPowerControls = () => {
  const { labs, toggleLabPower, togglePCPower } = useSimulation();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Lab Power Controls</h1>
        <p className="text-muted-foreground text-sm mt-1">Manual master switches for each lab</p>
      </div>

      <div className="space-y-4">
        {labs.map(lab => (
          <div key={lab.name} className="bg-card rounded-xl border border-border overflow-hidden">
            {/* Lab header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="flex items-center gap-3">
                <Server className="w-5 h-5 text-muted-foreground" />
                <span className="font-semibold text-foreground">{lab.name}</span>
                <span className="text-xs text-muted-foreground font-mono">({lab.pcs.length} systems)</span>
              </div>
              <button
                onClick={() => toggleLabPower(lab.name)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  lab.masterOn
                    ? 'bg-primary/10 text-primary glow-box-emerald hover:bg-primary/20'
                    : 'bg-destructive/10 text-neon-rose glow-box-rose hover:bg-destructive/20'
                }`}
              >
                <Power className="w-4 h-4" />
                {lab.masterOn ? 'ONLINE' : 'OFFLINE'}
              </button>
            </div>

            {/* PCs grid */}
            <div className="p-4 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
              {lab.pcs.map(pc => {
                const isOff = pc.status === 'Auto-Shutdown' || pc.status === 'Manual-Off';
                const isIdle = pc.status === 'Idle';
                return (
                  <button
                    key={pc.id}
                    onClick={() => togglePCPower(lab.name, pc.id)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-lg border text-xs transition-all ${
                      isOff
                        ? 'border-border bg-secondary/30 text-muted-foreground'
                        : isIdle
                        ? 'border-neon-amber/30 bg-neon-amber/5 text-neon-amber'
                        : 'border-primary/30 bg-primary/5 text-primary'
                    }`}
                  >
                    <Monitor className="w-4 h-4" />
                    <span className="font-mono truncate w-full text-center">{pc.name}</span>
                    <span className="text-[10px] opacity-70">{pc.cpu.toFixed(0)}%</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LabPowerControls;
