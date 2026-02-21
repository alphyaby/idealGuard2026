import { useVMScheduler } from "@/hooks/useVMScheduler";
import ResourceTable from "@/components/ResourceTable";
import SchedulerPanel from "@/components/SchedulerPanel";
import ActionLog from "@/components/ActionLog";
import SavingsSummary from "@/components/SavingsSummary";
import { Activity } from "lucide-react";

const Index = () => {
  const {
    vms,
    logs,
    idleVMs,
    runningVMs,
    totalHourlyCost,
    dailySavings,
    monthlySavings,
    potentialDailySavings,
    potentialMonthlySavings,
    applySchedule,
    startAll,
    successMessage,
  } = useVMScheduler();

  const hasStoppedVMs = vms.some((vm) => vm.status === "Stopped");
  const hasIdleVMs = idleVMs.length > 0;

  return (
    <div className="min-h-screen bg-background grid-pattern">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 glow-primary">
            <Activity className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">
              Idle Resource Auto-Scheduler
            </h1>
            <p className="text-xs text-muted-foreground font-mono">
              FinOps • Idle Detection • Cost Optimization
            </p>
          </div>
          <div className="ml-auto flex items-center gap-4 text-sm font-mono">
            <div className="hidden sm:flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-running animate-pulse-glow" />
              <span className="text-muted-foreground">{runningVMs.length} running</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-idle" />
              <span className="text-muted-foreground">{idleVMs.length} idle</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <ResourceTable vms={vms} totalHourlyCost={totalHourlyCost} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SchedulerPanel
            onApplySchedule={applySchedule}
            onStartAll={startAll}
            hasStoppedVMs={hasStoppedVMs}
            hasIdleVMs={hasIdleVMs}
            successMessage={successMessage}
          />
          <SavingsSummary
            dailySavings={dailySavings}
            monthlySavings={monthlySavings}
            potentialDailySavings={potentialDailySavings}
            potentialMonthlySavings={potentialMonthlySavings}
          />
        </div>

        <ActionLog logs={logs} />
      </main>
    </div>
  );
};

export default Index;
