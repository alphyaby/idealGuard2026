import { LogEntry } from "@/hooks/useVMScheduler";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText } from "lucide-react";

interface ActionLogProps {
  logs: LogEntry[];
}

export default function ActionLog({ logs }: ActionLogProps) {
  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
        <FileText className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Action Log</h2>
        {logs.length > 0 && (
          <span className="ml-auto text-xs font-mono text-muted-foreground">{logs.length} entries</span>
        )}
      </div>
      <ScrollArea className="h-56">
        {logs.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm py-12">
            No actions recorded yet
          </div>
        ) : (
          <div className="p-3 space-y-1.5">
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex items-center gap-3 px-3 py-2 rounded-md bg-muted/50 font-mono text-sm animate-slide-in"
              >
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    log.action === "Stopped" ? "bg-stopped" : "bg-running"
                  }`}
                />
                <span className="text-foreground font-medium">{log.vmName}</span>
                <span className={log.action === "Stopped" ? "text-stopped" : "text-running"}>
                  {log.action === "Stopped" ? "shut down" : "started"}
                </span>
                <span className="text-muted-foreground ml-auto">at {log.time}</span>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
