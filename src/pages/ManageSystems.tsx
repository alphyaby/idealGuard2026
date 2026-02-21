import { useState } from 'react';
import { useSimulation } from '@/contexts/SimulationContext';
import { Plus, Server, Monitor } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ManageSystems = () => {
  const { labs, addSystem } = useSimulation();
  const { toast } = useToast();
  const [selectedLab, setSelectedLab] = useState(labs[0]?.name || '');
  const [name, setName] = useState('');
  const [ip, setIp] = useState('');
  const [type, setType] = useState<'pc' | 'server'>('pc');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !ip || !selectedLab) return;
    addSystem(selectedLab, name, ip, type);
    toast({ title: 'System Added', description: `${name} (${ip}) added to ${selectedLab}` });
    setName('');
    setIp('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Manage Systems (IP Registry)</h1>
        <p className="text-muted-foreground text-sm mt-1">Add new computers or servers to the monitoring network</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border p-6 space-y-4 max-w-lg">
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

        <div>
          <label className="block text-sm text-muted-foreground mb-1.5">System Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. PC-NEW-01"
            className="w-full bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm text-muted-foreground mb-1.5">IP Address</label>
          <input
            type="text"
            value={ip}
            onChange={e => setIp(e.target.value)}
            placeholder="e.g. 192.168.1.100"
            className="w-full bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary font-mono"
          />
        </div>

        <div>
          <label className="block text-sm text-muted-foreground mb-1.5">Type</label>
          <div className="flex gap-3">
            {(['pc', 'server'] as const).map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm transition-all ${
                  type === t
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-secondary text-muted-foreground hover:text-foreground'
                }`}
              >
                {t === 'pc' ? <Monitor className="w-4 h-4" /> : <Server className="w-4 h-4" />}
                {t.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity glow-box-emerald"
        >
          <Plus className="w-4 h-4" />
          Add System
        </button>
      </form>
    </div>
  );
};

export default ManageSystems;
