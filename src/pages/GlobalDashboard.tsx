import { useSimulation } from '@/contexts/SimulationContext';
import { Server, Cpu, IndianRupee, AlertTriangle, TrendingDown, Zap } from 'lucide-react';

const GlobalDashboard = () => {
  const { labs, totalSavingsToday, totalSavingsMonth, actionLog } = useSimulation();

  const allPCs = labs.flatMap(l => l.pcs);
  const totalActive = allPCs.filter(p => p.status === 'Running').length;
  const totalIdle = allPCs.filter(p => p.status === 'Idle').length;
  const totalShutdown = allPCs.filter(p => p.status === 'Auto-Shutdown' || p.status === 'Manual-Off').length;
  const totalSystems = allPCs.length;

  const kpis = [
    { label: 'Total Systems', value: totalSystems, icon: Server, color: 'text-neon-cyan', glow: 'glow-box-cyan' },
    { label: 'Active', value: totalActive, icon: Zap, color: 'text-primary', glow: 'glow-box-emerald' },
    { label: 'Idle (Flagged)', value: totalIdle, icon: AlertTriangle, color: 'text-neon-amber', glow: 'glow-box-amber' },
    { label: 'Shutdown', value: totalShutdown, icon: TrendingDown, color: 'text-neon-rose', glow: 'glow-box-rose' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Global Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Real-time campus infrastructure overview</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(({ label, value, icon: Icon, color, glow }) => (
          <div key={label} className={`bg-card rounded-xl border border-border p-5 ${glow} transition-all`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">{label}</span>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div className={`text-3xl font-bold font-mono ${color}`}>{value}</div>
          </div>
        ))}
      </div>

      {/* Savings Hero */}
      <div className="bg-card rounded-xl border border-border p-8 glow-box-emerald">
        <div className="flex items-center gap-3 mb-4">
          <IndianRupee className="w-8 h-8 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">30-Day Estimated Savings</p>
            <p className="text-4xl md:text-5xl font-black font-mono text-primary glow-emerald">
              ₹{totalSavingsMonth.toLocaleString('en-IN')}
            </p>
          </div>
        </div>
        <div className="flex gap-6 mt-4 text-sm">
          <div>
            <span className="text-muted-foreground">Today: </span>
            <span className="text-primary font-mono font-semibold">₹{totalSavingsToday.toLocaleString('en-IN')}</span>
          </div>
          <div>
            <span className="text-muted-foreground">AI Actions Today: </span>
            <span className="text-neon-amber font-mono font-semibold">
              {actionLog.filter(a => a.timestamp.toDateString() === new Date().toDateString()).length}
            </span>
          </div>
        </div>
      </div>

      {/* Lab Overview Grid */}
      <div>
        <h2 className="text-lg font-semibold mb-4 text-foreground">Lab Status Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {labs.map(lab => {
            const active = lab.pcs.filter(p => p.status === 'Running').length;
            const idle = lab.pcs.filter(p => p.status === 'Idle').length;
            const off = lab.pcs.filter(p => p.status === 'Auto-Shutdown' || p.status === 'Manual-Off').length;
            return (
              <div key={lab.name} className="bg-card rounded-lg border border-border p-4">
                <p className="text-sm font-medium text-foreground truncate mb-2">{lab.name}</p>
                <div className="flex gap-3 text-xs font-mono">
                  <span className="text-primary">{active} on</span>
                  <span className="text-neon-amber">{idle} idle</span>
                  <span className="text-neon-rose">{off} off</span>
                </div>
                {!lab.masterOn && <span className="text-[10px] text-neon-rose mt-1 block">MASTER OFF</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent AI Actions */}
      <div>
        <h2 className="text-lg font-semibold mb-4 text-foreground">Recent AI Actions</h2>
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {actionLog.length === 0 ? (
            <p className="p-6 text-muted-foreground text-sm text-center">No actions yet — AI engine is monitoring...</p>
          ) : (
            <div className="divide-y divide-border">
              {actionLog.slice(0, 8).map(entry => (
                <div key={entry.id} className="flex items-center justify-between px-5 py-3 text-sm">
                  <div className="flex items-center gap-3">
                    <Cpu className="w-4 h-4 text-neon-rose" />
                    <span className="text-foreground font-medium">{entry.vmName}</span>
                    <span className="text-muted-foreground">in {entry.lab}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-neon-rose text-xs font-mono">SHUTDOWN</span>
                    <span className="text-muted-foreground text-xs font-mono">
                      {entry.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GlobalDashboard;
