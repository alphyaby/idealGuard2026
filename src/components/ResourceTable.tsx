import { VM, isIdle } from "@/hooks/useVMScheduler";
import { Badge } from "@/components/ui/badge";
import { Server, Cpu, IndianRupee } from "lucide-react";

interface ResourceTableProps {
  vms: VM[];
  totalHourlyCost: number;
}

const StatusBadge = ({ vm }: { vm: VM }) => {
  if (vm.status === "Stopped") {
    return <Badge variant="destructive" className="bg-stopped/20 text-stopped border-stopped/30 font-mono text-xs">STOPPED</Badge>;
  }
  if (isIdle(vm)) {
    return <Badge className="bg-idle/20 text-idle border-idle/30 font-mono text-xs border">IDLE</Badge>;
  }
  return <Badge className="bg-running/20 text-running border-running/30 font-mono text-xs border">ACTIVE</Badge>;
};

export default function ResourceTable({ vms, totalHourlyCost }: ResourceTableProps) {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Server className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Cloud Resources</h2>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-sm">
          <span className="text-muted-foreground">Total Running Cost:</span>
          <span className="text-primary font-bold">₹{totalHourlyCost}/hr</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">VM Name</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">CPU Usage</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Cost/Hour</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody>
            {vms.map((vm, i) => (
              <tr
                key={vm.id}
                className={`border-b border-border/50 transition-colors ${
                  isIdle(vm) ? "bg-idle/5" : vm.status === "Stopped" ? "bg-stopped/5" : "hover:bg-muted/30"
                }`}
              >
                <td className="px-5 py-3.5">
                  <span className="font-mono font-medium text-foreground">{vm.name}</span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          vm.cpuUsage < 10 ? "bg-idle" : vm.cpuUsage < 60 ? "bg-primary" : "bg-running"
                        }`}
                        style={{ width: `${vm.status === "Stopped" ? 0 : vm.cpuUsage}%` }}
                      />
                    </div>
                    <span className="font-mono text-sm text-muted-foreground w-10">
                      {vm.status === "Stopped" ? "—" : `${vm.cpuUsage}%`}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-3.5 font-mono text-sm text-muted-foreground">₹{vm.costPerHour}</td>
                <td className="px-5 py-3.5"><StatusBadge vm={vm} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
