import { useState } from 'react';
import { useSimulation } from '@/contexts/SimulationContext';
import { Clock, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SmartScheduler = () => {
  const { labs, schedules, setSchedule } = useSimulation();
  const { toast } = useToast();
  const [selectedLab, setSelectedLab] = useState(labs[0]?.name || '');
  const [shutdown, setShutdown] = useState('22:00');
  const [startup, setStartup] = useState('08:00');

  const handleApply = () => {
    setSchedule(selectedLab, shutdown, startup);
    toast({ title: 'Schedule Applied', description: `${selectedLab}: Shutdown ${shutdown}, Startup ${startup}` });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Smart Scheduler</h1>
        <p className="text-muted-foreground text-sm mt-1">Set automated shutdown/startup cron schedules per lab</p>
      </div>

      <div className="bg-card rounded-xl border border-border p-6 max-w-lg space-y-4">
        <div>
          <label className="block text-sm text-muted-foreground mb-1.5">Lab</label>
          <select
            value={selectedLab}
            onChange={e => setSelectedLab(e.target.value)}
            className="w-full bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {labs.map(l => <option key={l.name} value={l.name}>{l.name}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-1.5">Shutdown Time</label>
            <input
              type="time"
              value={shutdown}
              onChange={e => setShutdown(e.target.value)}
              className="w-full bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1.5">Startup Time</label>
            <input
              type="time"
              value={startup}
              onChange={e => setStartup(e.target.value)}
              className="w-full bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <button
          onClick={handleApply}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity glow-box-emerald"
        >
          <Clock className="w-4 h-4" />
          Apply Schedule
        </button>
      </div>

      {/* Active Schedules */}
      <div>
        <h2 className="text-lg font-semibold mb-3 text-foreground">Active Schedules</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {labs.map(lab => {
            const s = schedules[lab.name];
            return (
              <div key={lab.name} className={`bg-card rounded-lg border p-4 ${s ? 'border-primary/30 glow-box-emerald' : 'border-border'}`}>
                <p className="text-sm font-medium text-foreground mb-1">{lab.name}</p>
                {s ? (
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <Check className="w-3 h-3 text-primary" />
                    <span className="text-primary">{s.shutdown} → {s.startup}</span>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">No schedule set</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SmartScheduler;
