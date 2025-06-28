
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
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
import OperatorPortal from "./pages/OperatorPortal";
import NotFound from "./pages/NotFound";
import Invoices from "./pages/Invoices";
import Reports from "./pages/Reports";
import Configuration from "./pages/Configuration";
import Auth from "./pages/Auth";
import Unauthorized from "./pages/Unauthorized";
import Index from "./pages/Index";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="tms-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/auth" element={<Auth />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              
              {/* Index route that handles redirection */}
              <Route path="/" element={<Index />} />
              
              {/* Protected admin routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute requiredRoles={['admin']}>
                  <MainLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Dashboard />} />
              </Route>
              
              <Route path="/admin/*" element={
                <ProtectedRoute requiredRoles={['admin']}>
                  <MainLayout />
                </ProtectedRoute>
              }>
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
              </Route>
              
              {/* Client portal - accessible by clients */}
              <Route path="/portal-client" element={
                <ProtectedRoute requiredRoles={['client']}>
                  <ClientPortal />
                </ProtectedRoute>
              } />
              
              {/* Operator portal - accessible by operators */}
              <Route path="/portal-operator" element={
                <ProtectedRoute requiredRoles={['operator']}>
                  <OperatorPortal />
                </ProtectedRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
