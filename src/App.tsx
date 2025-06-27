import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Services from "./pages/Services";
import Clients from "./pages/Clients";
import NotFound from "./pages/NotFound";

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
              <Route path="clients" element={<Clients />} />
              {/* Placeholder routes for other modules */}
              <Route path="service-types" element={<div className="p-6"><h1 className="text-2xl font-bold">Tipos de Servicios</h1><p>Módulo en construcción...</p></div>} />
              <Route path="cranes" element={<div className="p-6"><h1 className="text-2xl font-bold">Grúas</h1><p>Módulo en construcción...</p></div>} />
              <Route path="operators" element={<div className="p-6"><h1 className="text-2xl font-bold">Operadores</h1><p>Módulo en construcción...</p></div>} />
              <Route path="closures" element={<div className="p-6"><h1 className="text-2xl font-bold">Cierres</h1><p>Módulo en construcción...</p></div>} />
              <Route path="invoices" element={<div className="p-6"><h1 className="text-2xl font-bold">Facturas</h1><p>Módulo en construcción...</p></div>} />
              <Route path="costs" element={<div className="p-6"><h1 className="text-2xl font-bold">Costos</h1><p>Módulo en construcción...</p></div>} />
              <Route path="reports" element={<div className="p-6"><h1 className="text-2xl font-bold">Reportes</h1><p>Módulo en construcción...</p></div>} />
              <Route path="calendar" element={<div className="p-6"><h1 className="text-2xl font-bold">Calendario</h1><p>Módulo en construcción...</p></div>} />
              <Route path="configuration" element={<div className="p-6"><h1 className="text-2xl font-bold">Configuración</h1><p>Módulo en construcción...</p></div>} />
              <Route path="portal-operator" element={<div className="p-6"><h1 className="text-2xl font-bold">Portal del Operador</h1><p>Módulo en construcción...</p></div>} />
              <Route path="portal-client" element={<div className="p-6"><h1 className="text-2xl font-bold">Portal del Cliente</h1><p>Módulo en construcción...</p></div>} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
