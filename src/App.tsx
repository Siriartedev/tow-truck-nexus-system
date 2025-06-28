
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
              
              {/* Protected admin routes with MainLayout */}
              <Route path="/dashboard" element={
                <ProtectedRoute requiredRoles={['admin']}>
                  <MainLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Dashboard />} />
              </Route>
              
              <Route path="/services" element={
                <ProtectedRoute requiredRoles={['admin']}>
                  <MainLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Services />} />
              </Route>
              
              <Route path="/service-types" element={
                <ProtectedRoute requiredRoles={['admin']}>
                  <MainLayout />
                </ProtectedRoute>
              }>
                <Route index element={<ServiceTypes />} />
              </Route>
              
              <Route path="/clients" element={
                <ProtectedRoute requiredRoles={['admin']}>
                  <MainLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Clients />} />
              </Route>
              
              <Route path="/cranes" element={
                <ProtectedRoute requiredRoles={['admin']}>
                  <MainLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Cranes />} />
              </Route>
              
              <Route path="/operators" element={
                <ProtectedRoute requiredRoles={['admin']}>
                  <MainLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Operators />} />
              </Route>
              
              <Route path="/calendar" element={
                <ProtectedRoute requiredRoles={['admin']}>
                  <MainLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Calendar />} />
              </Route>
              
              <Route path="/closures" element={
                <ProtectedRoute requiredRoles={['admin']}>
                  <MainLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Closures />} />
              </Route>
              
              <Route path="/invoices" element={
                <ProtectedRoute requiredRoles={['admin']}>
                  <MainLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Invoices />} />
              </Route>
              
              <Route path="/costs" element={
                <ProtectedRoute requiredRoles={['admin']}>
                  <MainLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Costs />} />
              </Route>
              
              <Route path="/reports" element={
                <ProtectedRoute requiredRoles={['admin']}>
                  <MainLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Reports />} />
              </Route>
              
              <Route path="/configuration" element={
                <ProtectedRoute requiredRoles={['admin']}>
                  <MainLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Configuration />} />
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
