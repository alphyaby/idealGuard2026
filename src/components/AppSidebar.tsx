import { useLocation } from 'react-router-dom';
import { NavLink } from '@/components/NavLink';
import {
  LayoutDashboard, Cpu, Clock, TrendingUp, IndianRupee,
  FileText, Settings, Leaf, Shield, Server, CalendarDays, Plus, X
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Global Dashboard' },
  { to: '/dashboard/idle-monitor', icon: Cpu, label: 'Idle CPU Monitor' },
  { to: '/dashboard/power-controls', icon: Server, label: 'Lab Power Controls' },
  { to: '/dashboard/manage-systems', icon: Plus, label: 'Manage Systems' },
  { to: '/dashboard/scheduler', icon: Clock, label: 'Smart Scheduler' },
  { to: '/dashboard/calendar', icon: CalendarDays, label: 'Financial Calendar' },
  { to: '/dashboard/savings', icon: IndianRupee, label: 'Lab Savings' },
  { to: '/dashboard/usage-analysis', icon: TrendingUp, label: 'Usage Analysis' },
  { to: '/dashboard/action-log', icon: FileText, label: 'Action Log' },
  { to: '/dashboard/settings', icon: Settings, label: 'Interface Settings' },
  { to: '/dashboard/impact', icon: Leaf, label: 'Resource Impact' },
];

interface AppSidebarProps {
  onClose: () => void;
}

const AppSidebar = ({ onClose }: AppSidebarProps) => {
  const location = useLocation();

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-5 border-b border-border">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-primary" />
          <span className="font-bold text-sm tracking-widest text-primary glow-emerald">IDLE GUARD</span>
        </div>
        <button onClick={onClose} className="lg:hidden p-1 text-muted-foreground hover:text-foreground">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname === to || (to !== '/dashboard' && location.pathname.startsWith(to));
          const isExactDashboard = to === '/dashboard' && location.pathname === '/dashboard';
          const active = to === '/dashboard' ? isExactDashboard : isActive;

          return (
            <NavLink
              key={to}
              to={to}
              end={to === '/dashboard'}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                active
                  ? 'bg-primary/10 text-primary glow-box-emerald'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
              }`}
              activeClassName=""
              onClick={onClose}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground/50 font-mono text-center">
          v2.1.0 • AI Engine Active
        </div>
      </div>
    </div>
  );
};

export default AppSidebar;
