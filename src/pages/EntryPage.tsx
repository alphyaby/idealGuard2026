import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Zap, Server, Activity } from 'lucide-react';

const EntryPage = () => {
  const navigate = useNavigate();
  const [entering, setEntering] = useState(false);

  const handleEnter = () => {
    setEntering(true);
    setTimeout(() => navigate('/dashboard'), 600);
  };

  return (
    <div className={`min-h-screen bg-background grid-bg flex items-center justify-center relative overflow-hidden transition-opacity duration-500 ${entering ? 'opacity-0 scale-105' : 'opacity-100'}`}>
      {/* Ambient glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-emerald/5 rounded-full blur-[120px] animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-neon-cyan/5 rounded-full blur-[100px] animate-float" style={{ animationDelay: '3s' }} />

      <div className="relative z-10 text-center px-6 max-w-3xl">
        {/* Logo mark */}
        <div className="flex items-center justify-center mb-8">
          <div className="relative">
            <Shield className="w-16 h-16 text-primary glow-emerald" />
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4 glow-emerald text-primary">
          IDLE GUARD
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground mb-2 font-light tracking-wide">
          AI-Powered Campus Resource & Power Management
        </p>
        <p className="text-sm text-muted-foreground/60 mb-12 max-w-lg mx-auto">
          Predictive auto-scheduling • Real-time idle detection • FinOps intelligence
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {[
            { icon: Zap, label: 'Auto-Shutdown AI' },
            { icon: Activity, label: 'Live Telemetry' },
            { icon: Server, label: '10 Labs Monitored' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-secondary/50 text-sm text-secondary-foreground">
              <Icon className="w-4 h-4 text-primary" />
              {label}
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={handleEnter}
          className="group relative inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-lg text-lg transition-all duration-300 hover:scale-105 glow-box-emerald hover:shadow-[0_0_30px_hsl(160_84%_39%/0.3)]"
        >
          <Shield className="w-5 h-5" />
          Initialize System
          <span className="absolute inset-0 rounded-lg bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>

        <p className="mt-6 text-xs text-muted-foreground/40 font-mono">
          v2.1.0 • STATUS: ALL SYSTEMS NOMINAL
        </p>
      </div>

      {/* Scanline effect */}
      <div className="absolute inset-0 scanline pointer-events-none" />
    </div>
  );
};

export default EntryPage;
