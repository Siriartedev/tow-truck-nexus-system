
import { useState } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  LayoutDashboard, 
  Truck, 
  Users, 
  Wrench, 
  ClipboardList,
  Calendar,
  FileText,
  DollarSign,
  PieChart,
  Settings,
  Menu,
  Building,
  UserCheck,
  LogOut
} from 'lucide-react';
import UserMenu from './UserMenu';
import { useAuth } from '@/hooks/useAuth';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Servicios', href: '/services', icon: ClipboardList },
  { name: 'Tipos de Servicio', href: '/service-types', icon: Wrench },
  { name: 'Clientes', href: '/clients', icon: Users },
  { name: 'Grúas', href: '/cranes', icon: Truck },
  { name: 'Operadores', href: '/operators', icon: UserCheck },
  { name: 'Calendario', href: '/calendar', icon: Calendar },
  { name: 'Cierres', href: '/closures', icon: FileText },
  { name: 'Facturas', href: '/invoices', icon: DollarSign },
  { name: 'Costos', href: '/costs', icon: DollarSign },
  { name: 'Reportes', href: '/reports', icon: PieChart },
  { name: 'Configuración', href: '/configuration', icon: Settings },
];

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();

  const handlePortalAccess = () => {
    if (profile?.role === 'client') {
      navigate('/portal-client');
    } else if (profile?.role === 'operator') {
      navigate('/portal-operator');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-card border-r border-border px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-green-medium p-2 rounded-lg">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">TMS Grúas</h1>
                <p className="text-xs text-muted-foreground">Sistema de Gestión</p>
              </div>
            </div>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      >
                        <item.icon className="h-6 w-6 shrink-0" />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="mt-auto">
                <div className="border-t border-border pt-4 space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePortalAccess}
                    className="w-full justify-start"
                  >
                    <Building className="h-4 w-4 mr-2" />
                    Portal de {profile?.role === 'client' ? 'Cliente' : 'Operador'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={signOut}
                    className="w-full justify-start text-red-600 hover:text-red-700"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Cerrar Sesión
                  </Button>
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-card px-4 py-4 shadow-sm sm:px-6 lg:hidden border-b border-border">
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="-m-2.5">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <div className="flex-1 text-sm font-semibold leading-6 text-foreground">
            TMS Grúas
          </div>
          <UserMenu />
        </div>

        <SheetContent side="left" className="w-72 p-0">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-card px-6 pb-4">
            <div className="flex h-16 shrink-0 items-center">
              <div className="flex items-center space-x-3">
                <div className="bg-green-medium p-2 rounded-lg">
                  <Truck className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">TMS Grúas</h1>
                  <p className="text-xs text-muted-foreground">Sistema de Gestión</p>
                </div>
              </div>
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <Link
                          to={item.href}
                          onClick={() => setSidebarOpen(false)}
                          className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        >
                          <item.icon className="h-6 w-6 shrink-0" />
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              </ul>
            </nav>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop header */}
      <div className="hidden lg:pl-72 lg:block">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-border bg-card px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <div className="flex flex-1 items-center justify-end gap-x-4 lg:gap-x-6">
            <UserMenu />
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="lg:pl-72">
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
