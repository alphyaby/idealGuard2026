import { useSimulation } from '@/contexts/SimulationContext';
import { FileText, Cpu, Play, Square } from 'lucide-react';

const ActionLog = () => {
  const { actionLog } = useSimulation();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Action Log & Reports</h1>
        <p className="text-muted-foreground text-sm mt-1">Immutable audit trail of all system state changes</p>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {actionLog.length === 0 ? (
          <p className="p-8 text-center text-muted-foreground text-sm">No actions recorded yet — AI engine monitoring in progress...</p>
        ) : (
          <div className="divide-y divide-border">
            {actionLog.slice(0, 30).map(entry => (
              <div key={entry.id} className="flex items-center gap-4 px-5 py-3 text-sm hover:bg-secondary/20 transition-colors">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  entry.action === 'STOP' ? 'bg-neon-rose/10 text-neon-rose' : 'bg-primary/10 text-primary'
                }`}>
                  {entry.action === 'STOP' ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-foreground font-medium truncate">{entry.vmName} <span className="text-muted-foreground font-normal">in {entry.lab}</span></p>
                  <p className="text-xs text-muted-foreground">
                    {entry.trigger === 'AI' ? '🤖 AI Auto-Action' : entry.trigger} • Saves ₹{entry.savingsPerHour}/hr
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className={`text-xs font-mono font-medium ${entry.action === 'STOP' ? 'text-neon-rose' : 'text-primary'}`}>
                    {entry.action}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-mono">{entry.timestamp.toLocaleTimeString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActionLog;
