import { useSimulation } from '@/contexts/SimulationContext';
import { CalendarDays, IndianRupee } from 'lucide-react';

const AdminCalendar = () => {
  const { dailySavings } = useSimulation();

  // Build calendar grid for current month
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = now.toLocaleString('default', { month: 'long', year: 'numeric' });

  const cells: (null | { day: number; amount: number })[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const entry = dailySavings.find(s => s.date === dateStr);
    cells.push({ day: d, amount: entry?.amount || 0 });
  }

  const maxSavings = Math.max(...dailySavings.map(d => d.amount), 1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin Financial Calendar</h1>
        <p className="text-muted-foreground text-sm mt-1">Daily savings heatmap — {monthName}</p>
      </div>

      <div className="bg-card rounded-xl border border-border p-6">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="text-center text-xs text-muted-foreground font-medium py-1">{d}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-2">
          {cells.map((cell, i) => {
            if (!cell) return <div key={i} />;
            const intensity = cell.amount / maxSavings;
            const isToday = cell.day === now.getDate();
            return (
              <div
                key={i}
                className={`aspect-square rounded-lg border flex flex-col items-center justify-center p-1 transition-all ${
                  isToday ? 'border-primary glow-box-emerald' : 'border-border'
                }`}
                style={{
                  backgroundColor: `hsl(160 84% 39% / ${Math.max(intensity * 0.25, 0.02)})`,
                }}
              >
                <span className={`text-xs ${isToday ? 'text-primary font-bold' : 'text-muted-foreground'}`}>{cell.day}</span>
                {cell.amount > 0 && (
                  <span className="text-[10px] font-mono text-primary mt-0.5">₹{cell.amount}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminCalendar;
