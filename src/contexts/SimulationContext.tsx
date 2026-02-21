import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface PC {
  id: string;
  name: string;
  ip: string;
  cpu: number;
  memory: number;
  networkKbps: number;
  status: 'Running' | 'Idle' | 'Auto-Shutdown' | 'Manual-Off';
  type: 'pc' | 'server';
  idleTicks: number;
  lab: string;
}

export interface Lab {
  name: string;
  pcs: PC[];
  masterOn: boolean;
}

export interface ActionLogEntry {
  id: string;
  timestamp: Date;
  vmId: string;
  vmName: string;
  lab: string;
  action: 'STOP' | 'START';
  trigger: 'AI' | 'Manual' | 'Scheduled';
  savingsPerHour: number;
}

export interface DaySavings {
  date: string;
  amount: number;
}

interface SimulationContextType {
  labs: Lab[];
  actionLog: ActionLogEntry[];
  dailySavings: DaySavings[];
  totalSavingsToday: number;
  totalSavingsMonth: number;
  toggleLabPower: (labName: string) => void;
  togglePCPower: (labName: string, pcId: string) => void;
  addSystem: (labName: string, name: string, ip: string, type: 'pc' | 'server') => void;
  setSchedule: (labName: string, shutdownTime: string, startupTime: string) => void;
  schedules: Record<string, { shutdown: string; startup: string }>;
}

const SimulationContext = createContext<SimulationContextType | null>(null);

const LAB_NAMES = [
  'Systems Lab', 'CCF Lab', 'OS Lab', 'CSE Lab', 'ASAP Lab',
  'Seminar Hall', 'Programming Lab 1', 'Programming Lab 2', 'OS Lab 2', 'EC Lab'
];

const COST_PER_HOUR_PC = 12; // ₹12/hr per PC
const COST_PER_HOUR_SERVER = 45; // ₹45/hr per server

function generateIP(): string {
  return `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 254) + 1}`;
}

function createInitialLabs(): Lab[] {
  return LAB_NAMES.map((name) => {
    const pcCount = Math.floor(Math.random() * 8) + 8;
    const pcs: PC[] = [];
    
    // Add server
    pcs.push({
      id: `${name}-SRV-01`,
      name: `${name.replace(/\s/g, '-')}-SRV-01`,
      ip: generateIP(),
      cpu: Math.random() * 60 + 20,
      memory: Math.random() * 40 + 30,
      networkKbps: Math.random() * 500 + 50,
      status: 'Running',
      type: 'server',
      idleTicks: 0,
      lab: name,
    });

    // Add PCs
    for (let i = 1; i <= pcCount; i++) {
      pcs.push({
        id: `${name}-PC-${String(i).padStart(2, '0')}`,
        name: `PC-${String(i).padStart(2, '0')}`,
        ip: generateIP(),
        cpu: Math.random() * 80 + 5,
        memory: Math.random() * 60 + 10,
        networkKbps: Math.random() * 300 + 10,
        status: 'Running',
        type: 'pc',
        idleTicks: 0,
        lab: name,
      });
    }

    return { name, pcs, masterOn: true };
  });
}

function generateHistoricalSavings(): DaySavings[] {
  const savings: DaySavings[] = [];
  const now = new Date();
  for (let i = 30; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    savings.push({
      date: d.toISOString().split('T')[0],
      amount: Math.floor(Math.random() * 2000) + 500,
    });
  }
  return savings;
}

export const SimulationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [labs, setLabs] = useState<Lab[]>(createInitialLabs);
  const [actionLog, setActionLog] = useState<ActionLogEntry[]>([]);
  const [dailySavings] = useState<DaySavings[]>(generateHistoricalSavings);
  const [schedules, setSchedules] = useState<Record<string, { shutdown: string; startup: string }>>({});
  const { toast } = useToast();
  const toastRef = useRef(toast);
  toastRef.current = toast;

  // AI simulation tick
  useEffect(() => {
    const interval = setInterval(() => {
      setLabs(prevLabs => {
        const newLabs = prevLabs.map(lab => {
          if (!lab.masterOn) return lab;
          
          const newPcs = lab.pcs.map(pc => {
            if (pc.status === 'Auto-Shutdown' || pc.status === 'Manual-Off') return pc;

            // Fluctuate CPU randomly
            let newCpu = pc.cpu + (Math.random() - 0.5) * 20;
            newCpu = Math.max(0, Math.min(100, newCpu));
            let newNetwork = pc.networkKbps + (Math.random() - 0.5) * 100;
            newNetwork = Math.max(0, Math.min(1000, newNetwork));
            let newMemory = pc.memory + (Math.random() - 0.5) * 10;
            newMemory = Math.max(5, Math.min(100, newMemory));

            const isIdleCpu = newCpu < 10;
            const isIdleNetwork = newNetwork < 10;
            
            let newIdleTicks = pc.idleTicks;
            let newStatus: PC['status'] = pc.status;

            if (pc.type === 'pc') {
              if (isIdleCpu) {
                newIdleTicks++;
                newStatus = 'Idle';
                if (newIdleTicks >= 3) {
                  newStatus = 'Auto-Shutdown';
                  setTimeout(() => {
                    toastRef.current({
                      title: "🤖 AI Action",
                      description: `${pc.name} in ${lab.name} shut down due to idle condition`,
                    });
                  }, 0);
                  setActionLog(prev => [{
                    id: `${Date.now()}-${pc.id}`,
                    timestamp: new Date(),
                    vmId: pc.id,
                    vmName: pc.name,
                    lab: lab.name,
                    action: 'STOP' as const,
                    trigger: 'AI' as const,
                    savingsPerHour: COST_PER_HOUR_PC,
                  }, ...prev].slice(0, 100));
                }
              } else {
                newIdleTicks = 0;
                newStatus = 'Running';
              }
            } else {
              // Server: stricter — CPU < 5% AND network < 10kbps for 5 ticks
              if (newCpu < 5 && isIdleNetwork) {
                newIdleTicks++;
                newStatus = 'Idle';
                if (newIdleTicks >= 5) {
                  newStatus = 'Auto-Shutdown';
                  setTimeout(() => {
                    toastRef.current({
                      title: "🤖 AI Server Action",
                      description: `Server in ${lab.name} shut down — CPU <5%, Network <10kbps`,
                    });
                  }, 0);
                  setActionLog(prev => [{
                    id: `${Date.now()}-${pc.id}`,
                    timestamp: new Date(),
                    vmId: pc.id,
                    vmName: pc.name,
                    lab: lab.name,
                    action: 'STOP' as const,
                    trigger: 'AI' as const,
                    savingsPerHour: COST_PER_HOUR_SERVER,
                  }, ...prev].slice(0, 100));
                }
              } else {
                newIdleTicks = 0;
                newStatus = 'Running';
              }
            }

            return { ...pc, cpu: newCpu, memory: newMemory, networkKbps: newNetwork, idleTicks: newIdleTicks, status: newStatus };
          });

          return { ...lab, pcs: newPcs };
        });
        return newLabs;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const totalSavingsToday = actionLog
    .filter(e => e.action === 'STOP' && e.timestamp.toDateString() === new Date().toDateString())
    .reduce((sum, e) => sum + e.savingsPerHour * 2, 0);

  const totalSavingsMonth = dailySavings.reduce((sum, d) => sum + d.amount, 0) + totalSavingsToday;

  const toggleLabPower = useCallback((labName: string) => {
    setLabs(prev => prev.map(lab => {
      if (lab.name !== labName) return lab;
      const newMaster = !lab.masterOn;
      return {
        ...lab,
        masterOn: newMaster,
        pcs: lab.pcs.map(pc => ({
          ...pc,
          status: newMaster ? 'Running' : 'Manual-Off',
          cpu: newMaster ? Math.random() * 50 + 10 : 0,
          idleTicks: 0,
        })),
      };
    }));
  }, []);

  const togglePCPower = useCallback((labName: string, pcId: string) => {
    setLabs(prev => prev.map(lab => {
      if (lab.name !== labName) return lab;
      return {
        ...lab,
        pcs: lab.pcs.map(pc => {
          if (pc.id !== pcId) return pc;
          const isOff = pc.status === 'Auto-Shutdown' || pc.status === 'Manual-Off';
          return {
            ...pc,
            status: isOff ? 'Running' : 'Manual-Off',
            cpu: isOff ? Math.random() * 50 + 20 : 0,
            idleTicks: 0,
          };
        }),
      };
    }));
  }, []);

  const addSystem = useCallback((labName: string, name: string, ip: string, type: 'pc' | 'server') => {
    setLabs(prev => prev.map(lab => {
      if (lab.name !== labName) return lab;
      const newPC: PC = {
        id: `${labName}-${name}-${Date.now()}`,
        name,
        ip,
        cpu: Math.random() * 50 + 10,
        memory: Math.random() * 40 + 20,
        networkKbps: Math.random() * 200 + 20,
        status: 'Running',
        type,
        idleTicks: 0,
        lab: labName,
      };
      return { ...lab, pcs: [...lab.pcs, newPC] };
    }));
  }, []);

  const setSchedule = useCallback((labName: string, shutdownTime: string, startupTime: string) => {
    setSchedules(prev => ({ ...prev, [labName]: { shutdown: shutdownTime, startup: startupTime } }));
  }, []);

  return (
    <SimulationContext.Provider value={{
      labs, actionLog, dailySavings, totalSavingsToday, totalSavingsMonth,
      toggleLabPower, togglePCPower, addSystem, setSchedule, schedules,
    }}>
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => {
  const ctx = useContext(SimulationContext);
  if (!ctx) throw new Error('useSimulation must be used within SimulationProvider');
  return ctx;
};
