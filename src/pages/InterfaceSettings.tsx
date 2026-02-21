import { Settings, Moon, Bell, Shield } from 'lucide-react';

const InterfaceSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">User-Friendly Interface</h1>
        <p className="text-muted-foreground text-sm mt-1">UI preferences and settings</p>
      </div>

      <div className="max-w-lg space-y-4">
        {[
          { icon: Moon, label: 'Dark Mode', desc: 'Night theme is always active for optimal data visibility', enabled: true },
          { icon: Bell, label: 'AI Notifications', desc: 'Toast alerts when AI shuts down idle resources', enabled: true },
          { icon: Shield, label: 'Safety Confirmations', desc: 'Require confirmation before manual bulk shutdowns', enabled: false },
        ].map(({ icon: Icon, label, desc, enabled }) => (
          <div key={label} className="bg-card rounded-xl border border-border p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Icon className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            </div>
            <div className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${enabled ? 'bg-primary' : 'bg-secondary'}`}>
              <div className={`w-4 h-4 rounded-full bg-foreground absolute top-1 transition-all ${enabled ? 'right-1' : 'left-1'}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InterfaceSettings;
