import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, Play, Zap } from "lucide-react";

interface SchedulerPanelProps {
  onApplySchedule: (shutdownTime: string, startupTime: string) => void;
  onStartAll: () => void;
  hasStoppedVMs: boolean;
  hasIdleVMs: boolean;
  successMessage: string | null;
}

export default function SchedulerPanel({
  onApplySchedule,
  onStartAll,
  hasStoppedVMs,
  hasIdleVMs,
  successMessage,
}: SchedulerPanelProps) {
  const [shutdownTime, setShutdownTime] = useState("22:00");
  const [startupTime, setStartupTime] = useState("08:00");

  const formatTime = (t: string) => {
    if (!t) return "";
    const [h, m] = t.split(":");
    const hour = parseInt(h);
    const ampm = hour >= 12 ? "PM" : "AM";
    const h12 = hour % 12 || 12;
    return `${h12}:${m} ${ampm}`;
  };

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Auto-Scheduler</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <div>
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Shutdown Time
          </label>
          <Input
            type="time"
            value={shutdownTime}
            onChange={(e) => setShutdownTime(e.target.value)}
            className="bg-muted border-border font-mono text-foreground"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Startup Time
          </label>
          <Input
            type="time"
            value={startupTime}
            onChange={(e) => setStartupTime(e.target.value)}
            className="bg-muted border-border font-mono text-foreground"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          onClick={() => onApplySchedule(formatTime(shutdownTime), formatTime(startupTime))}
          disabled={!hasIdleVMs}
          className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold gap-2"
        >
          <Zap className="h-4 w-4" />
          Apply Schedule
        </Button>
        <Button
          onClick={onStartAll}
          disabled={!hasStoppedVMs}
          variant="outline"
          className="border-running/30 text-running hover:bg-running/10 font-semibold gap-2"
        >
          <Play className="h-4 w-4" />
          Start All
        </Button>
      </div>

      {successMessage && (
        <div className="mt-4 px-4 py-2.5 rounded-md bg-running/10 border border-running/30 text-running text-sm font-medium animate-slide-in">
          ✓ {successMessage}
        </div>
      )}
    </div>
  );
}
