import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SimulationProvider } from "@/contexts/SimulationContext";
import EntryPage from "./pages/EntryPage";
import DashboardLayout from "./components/DashboardLayout";
import GlobalDashboard from "./pages/GlobalDashboard";
import IdleCPUMonitor from "./pages/IdleCPUMonitor";
import LabPowerControls from "./pages/LabPowerControls";
import ManageSystems from "./pages/ManageSystems";
import SmartScheduler from "./pages/SmartScheduler";
import AdminCalendar from "./pages/AdminCalendar";
import LabSavings from "./pages/LabSavings";
import UsageAnalysis from "./pages/UsageAnalysis";
import ActionLog from "./pages/ActionLog";
import InterfaceSettings from "./pages/InterfaceSettings";
import ResourceImpact from "./pages/ResourceImpact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SimulationProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<EntryPage />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<GlobalDashboard />} />
              <Route path="idle-monitor" element={<IdleCPUMonitor />} />
              <Route path="power-controls" element={<LabPowerControls />} />
              <Route path="manage-systems" element={<ManageSystems />} />
              <Route path="scheduler" element={<SmartScheduler />} />
              <Route path="calendar" element={<AdminCalendar />} />
              <Route path="savings" element={<LabSavings />} />
              <Route path="usage-analysis" element={<UsageAnalysis />} />
              <Route path="action-log" element={<ActionLog />} />
              <Route path="settings" element={<InterfaceSettings />} />
              <Route path="impact" element={<ResourceImpact />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </SimulationProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
