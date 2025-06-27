import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Services from "./pages/Services";
import ServiceTypes from "./pages/ServiceTypes";
import Clients from "./pages/Clients";
import Cranes from "./pages/Cranes";
import Operators from "./pages/Operators";
import Costs from "./pages/Costs";
import Calendar from "./pages/Calendar";
import Closures from "./pages/Closures";
import ClientPortal from "./pages/ClientPortal";
import NotFound from "./pages/NotFound";
import Invoices from "./pages/Invoices";
import Reports from "./pages/Reports";
import Configuration from "./pages/Configuration";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="tms-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="services" element={<Services />} />
              <Route path="service-types" element={<ServiceTypes />} />
              <Route path="clients" element={<Clients />} />
              <Route path="cranes" element={<Cranes />} />
              <Route path="operators" element={<Operators />} />
              <Route path="calendar" element={<Calendar />} />
              <Route path="closures" element={<Closures />} />
              <Route path="invoices" element={<Invoices />} />
              <Route path="costs" element={<Costs />} />
              <Route path="reports" element={<Reports />} />
              <Route path="configuration" element={<Configuration />} />
              <Route path="portal-operator" element={<div className="p-6"><h1 className="text-2xl font-bold">Portal del Operador</h1><p>Módulo en construcción...</p></div>} />
            </Route>
            {/* Client Portal - standalone route */}
            <Route path="portal-client" element={<ClientPortal />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
