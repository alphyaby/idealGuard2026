import { useState, useCallback } from "react";

export interface VM {
  id: string;
  name: string;
  cpuUsage: number;
  costPerHour: number;
  status: "Running" | "Stopped";
}

export interface LogEntry {
  id: string;
  vmName: string;
  action: "Stopped" | "Started";
  time: string;
}

const initialVMs: VM[] = [
  { id: "1", name: "VM-1", cpuUsage: 3, costPerHour: 12, status: "Running" },
  { id: "2", name: "VM-2", cpuUsage: 72, costPerHour: 25, status: "Running" },
  { id: "3", name: "VM-3", cpuUsage: 5, costPerHour: 18, status: "Running" },
  { id: "4", name: "VM-4", cpuUsage: 88, costPerHour: 30, status: "Running" },
  { id: "5", name: "VM-5", cpuUsage: 2, costPerHour: 15, status: "Running" },
  { id: "6", name: "VM-6", cpuUsage: 45, costPerHour: 22, status: "Running" },
  { id: "7", name: "VM-7", cpuUsage: 8, costPerHour: 20, status: "Running" },
  { id: "8", name: "VM-8", cpuUsage: 61, costPerHour: 28, status: "Running" },
];

export const isIdle = (vm: VM) => vm.cpuUsage < 10 && vm.status === "Running";

export function useVMScheduler() {
  const [vms, setVMs] = useState<VM[]>(initialVMs);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const idleVMs = vms.filter(isIdle);
  const runningVMs = vms.filter((vm) => vm.status === "Running");
  const totalHourlyCost = runningVMs.reduce((sum, vm) => sum + vm.costPerHour, 0);

  const idleCostPerHour = idleVMs.reduce((sum, vm) => sum + vm.costPerHour, 0);
  const stoppedIdleVMs = vms.filter((vm) => vm.status === "Stopped");
  const savedCostPerHour = stoppedIdleVMs.reduce((sum, vm) => sum + vm.costPerHour, 0);

  const dailySavings = savedCostPerHour * 10;
  const monthlySavings = dailySavings * 30;
  const potentialDailySavings = idleCostPerHour * 10;
  const potentialMonthlySavings = potentialDailySavings * 30;

  const applySchedule = useCallback(
    (shutdownTime: string, startupTime: string) => {
      const now = new Date();
      const timeStr = shutdownTime || now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

      const newLogs: LogEntry[] = [];
      setVMs((prev) =>
        prev.map((vm) => {
          if (isIdle(vm)) {
            newLogs.push({
              id: `${vm.id}-${Date.now()}`,
              vmName: vm.name,
              action: "Stopped",
              time: timeStr,
            });
            return { ...vm, status: "Stopped" };
          }
          return vm;
        })
      );
      setLogs((prev) => [...newLogs, ...prev]);
      setSuccessMessage("Auto-scheduler executed successfully.");
      setTimeout(() => setSuccessMessage(null), 4000);
    },
    []
  );

  const startAll = useCallback(() => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

    const newLogs: LogEntry[] = [];
    setVMs((prev) =>
      prev.map((vm) => {
        if (vm.status === "Stopped") {
          newLogs.push({
            id: `${vm.id}-${Date.now()}`,
            vmName: vm.name,
            action: "Started",
            time: timeStr,
          });
          return { ...vm, status: "Running" };
        }
        return vm;
      })
    );
    setLogs((prev) => [...newLogs, ...prev]);
    setSuccessMessage("All VMs started successfully.");
    setTimeout(() => setSuccessMessage(null), 4000);
  }, []);

  return {
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
  };
}
