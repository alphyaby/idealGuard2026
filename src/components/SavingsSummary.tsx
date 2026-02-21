import { TrendingDown, Wallet, CalendarDays } from "lucide-react";

interface SavingsSummaryProps {
  dailySavings: number;
  monthlySavings: number;
  potentialDailySavings: number;
  potentialMonthlySavings: number;
}

export default function SavingsSummary({
  dailySavings,
  monthlySavings,
  potentialDailySavings,
  potentialMonthlySavings,
}: SavingsSummaryProps) {
  const showPotential = potentialDailySavings > 0;

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-center gap-2 mb-5">
        <TrendingDown className="h-5 w-5 text-savings" />
        <h2 className="text-lg font-semibold text-foreground">Cost Savings</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-lg bg-muted/50 border border-border p-4 glow-savings">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="h-4 w-4 text-savings" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Daily Savings
            </span>
          </div>
          <div className="font-mono text-2xl font-bold text-savings">₹{dailySavings}</div>
          <p className="text-xs text-muted-foreground mt-1">Based on 10 idle hours/day</p>
        </div>

        <div className="rounded-lg bg-muted/50 border border-border p-4 glow-savings">
          <div className="flex items-center gap-2 mb-2">
            <CalendarDays className="h-4 w-4 text-savings" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Monthly Savings
            </span>
          </div>
          <div className="font-mono text-2xl font-bold text-savings">₹{monthlySavings}</div>
          <p className="text-xs text-muted-foreground mt-1">Projected over 30 days</p>
        </div>
      </div>

      {showPotential && (
        <div className="mt-4 px-4 py-3 rounded-md bg-idle/10 border border-idle/20">
          <p className="text-sm text-idle font-medium">
            ⚡ Potential additional savings: ₹{potentialDailySavings}/day (₹{potentialMonthlySavings}/month) from currently idle VMs
          </p>
        </div>
      )}
    </div>
  );
}
