
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Truck, 
  Users, 
  ClipboardList, 
  DollarSign,
  TrendingUp,
  Calendar,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export default function Dashboard() {
  const { profile } = useAuth();

  const stats = [
    {
      name: 'Servicios Activos',
      value: '12',
      icon: ClipboardList,
      change: '+2.5%',
      changeType: 'increase' as const,
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    },
    {
      name: 'Grúas Disponibles',
      value: '8',
      icon: Truck,
      change: '-1',
      changeType: 'decrease' as const,
      color: 'text-green-600',
      bg: 'bg-green-100'
    },
    {
      name: 'Operadores Activos',
      value: '15',
      icon: Users,
      change: '+3',
      changeType: 'increase' as const,
      color: 'text-purple-600',
      bg: 'bg-purple-100'
    },
    {
      name: 'Ingresos del Mes',
      value: '$2,450,000',
      icon: DollarSign,
      change: '+12.5%',
      changeType: 'increase' as const,
      color: 'text-green-600',
      bg: 'bg-green-100'
    },
  ];

  const recentServices = [
    {
      id: '1',
      folio: 'SRV-2024-001',
      client: 'Constructora ABC',
      status: 'in_progress',
      date: '2024-01-15',
      operator: 'Juan Pérez'
    },
    {
      id: '2',
      folio: 'SRV-2024-002',
      client: 'Empresa XYZ',
      status: 'pending',
      date: '2024-01-16',
      operator: 'María González'
    },
    {
      id: '3',
      folio: 'SRV-2024-003',
      client: 'Transportes 123',
      status: 'completed',
      date: '2024-01-14',
      operator: 'Carlos López'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pendiente</span>;
      case 'in_progress':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">En Progreso</span>;
      case 'completed':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Completado</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Desconocido</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Bienvenido al sistema TMS Grúas, {profile?.name}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/services">
            <Button className="bg-gradient-green hover:bg-gradient-green-hover">
              <ClipboardList className="h-4 w-4 mr-2" />
              Nuevo Servicio
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.name} className="card">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`p-3 rounded-lg ${stat.bg}`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-muted-foreground truncate">
                      {stat.name}
                    </p>
                    <div className="flex items-baseline">
                      <p className="text-2xl font-semibold text-foreground">
                        {stat.value}
                      </p>
                      <p className={`ml-2 flex items-baseline text-sm font-semibold ${
                        stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.changeType === 'increase' ? (
                          <TrendingUp className="h-4 w-4 mr-1" />
                        ) : (
                          <TrendingUp className="h-4 w-4 mr-1 rotate-180" />
                        )}
                        {stat.change}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Services */}
        <Card className="card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">
              Servicios Recientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentServices.map((service) => (
                <div key={service.id} className="flex items-center justify-between p-3 border rounded-lg border-green-dark/20">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-foreground">{service.folio}</p>
                      {getStatusBadge(service.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">{service.client}</p>
                    <p className="text-xs text-muted-foreground">
                      Operador: {service.operator} • {service.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Link to="/services">
                <Button variant="outline" className="w-full border-green-dark/20 hover:bg-green-light/10">
                  Ver Todos los Servicios
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">
              Acciones Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/services">
                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center border-green-dark/20 hover:bg-green-light/10">
                  <ClipboardList className="h-6 w-6 mb-2 text-green-medium" />
                  <span className="text-sm">Nuevo Servicio</span>
                </Button>
              </Link>
              <Link to="/clients">
                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center border-green-dark/20 hover:bg-green-light/10">
                  <Users className="h-6 w-6 mb-2 text-green-medium" />
                  <span className="text-sm">Nuevo Cliente</span>
                </Button>
              </Link>
              <Link to="/operators">
                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center border-green-dark/20 hover:bg-green-light/10">
                  <Users className="h-6 w-6 mb-2 text-green-medium" />
                  <span className="text-sm">Nuevo Operador</span>
                </Button>
              </Link>
              <Link to="/calendar">
                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center border-green-dark/20 hover:bg-green-light/10">
                  <Calendar className="h-6 w-6 mb-2 text-green-medium" />
                  <span className="text-sm">Ver Calendario</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      <Card className="card border-yellow-200 bg-yellow-50/50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-yellow-600" />
            Alertas del Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center p-3 bg-white rounded-lg border border-yellow-200">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-foreground">Licencias por vencer</p>
                <p className="text-xs text-muted-foreground">3 operadores tienen licencias que vencen en los próximos 30 días</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-white rounded-lg border border-yellow-200">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-foreground">Revisión técnica pendiente</p>
                <p className="text-xs text-muted-foreground">2 grúas requieren revisión técnica próximamente</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
