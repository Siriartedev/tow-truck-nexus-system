
import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Truck, 
  Users, 
  Settings, 
  Calendar,
  FileText,
  DollarSign,
  BarChart3,
  UserCheck,
  Building,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const sidebarItems = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Servicios', href: '/services', icon: Truck },
  { name: 'Tipos de Servicios', href: '/service-types', icon: Settings },
  { name: 'Clientes', href: '/clients', icon: Building },
  { name: 'Grúas', href: '/cranes', icon: Truck },
  { name: 'Operadores', href: '/operators', icon: UserCheck },
  { name: 'Cierres', href: '/closures', icon: FileText },
  { name: 'Facturas', href: '/invoices', icon: DollarSign },
  { name: 'Costos', href: '/costs', icon: DollarSign },
  { name: 'Reportes', href: '/reports', icon: BarChart3 },
  { name: 'Calendario', href: '/calendar', icon: Calendar },
  { name: 'Configuración', href: '/configuration', icon: Settings },
];

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={cn(
        "fixed inset-0 z-50 lg:hidden",
        sidebarOpen ? "block" : "hidden"
      )}>
        <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
        <div className="fixed left-0 top-0 h-full w-64 bg-gradient-green shadow-lg">
          <div className="flex items-center justify-between p-4 border-b border-green-darker/20">
            <h2 className="text-xl font-bold text-white">TMS Grúas</h2>
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="text-white hover:bg-green-darker/20">
              <X className="h-6 w-6" />
            </Button>
          </div>
          <nav className="p-4">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors mb-1",
                    location.pathname === item.href
                      ? "bg-white/20 text-white backdrop-blur-sm"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:left-0 lg:top-0 lg:h-full lg:w-64 lg:bg-gradient-green lg:shadow-lg lg:block">
        <div className="p-6 border-b border-green-darker/20">
          <h2 className="text-2xl font-bold text-white">TMS Grúas</h2>
        </div>
        <nav className="p-4">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors mb-1",
                  location.pathname === item.href
                    ? "bg-white/20 text-white backdrop-blur-sm"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b px-4 py-3">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-green-dark hover:bg-green-light/20"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <div className="flex items-center space-x-4">
              <Link to="/portal-operator">
                <Button variant="outline" size="sm" className="border-green-medium text-green-dark hover:bg-green-light/20">
                  Portal Operador
                </Button>
              </Link>
              <Link to="/portal-client">
                <Button variant="outline" size="sm" className="border-green-medium text-green-dark hover:bg-green-light/20">
                  Portal Cliente
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
