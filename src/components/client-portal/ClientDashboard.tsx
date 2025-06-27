
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  DollarSign, 
  Clock, 
  CheckCircle,
  TrendingUp,
  Calendar,
  Truck,
  AlertTriangle
} from 'lucide-react';

export default function ClientDashboard() {
  // Mock data - en producción vendría de la API
  const clientStats = {
    totalServices: 45,
    activeServices: 3,
    completedThisMonth: 8,
    totalSpent: 250000,
    monthlySpent: 35000,
    pendingPayments: 15000
  };

  const recentServices = [
    {
      id: '1',
      folio: 'SRV-20241220-3390',
      type: 'Montaje Industrial',
      status: 'in_progress',
      date: '2024-12-22',
      amount: 15000
    },
    {
      id: '2',
      folio: 'SRV-20241218-2850',
      type: 'Rescate Vehicular',
      status: 'completed',
      date: '2024-12-19',
      amount: 8000
    },
    {
      id: '3',
      folio: 'SRV-20241215-1750',
      type: 'Traslado de Equipo',
      status: 'pending',
      date: '2024-12-20',
      amount: 12000
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Bienvenido</h2>
          <p className="text-muted-foreground mt-1">
            Resumen de sus servicios y actividad reciente
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">
            Última actualización: {new Date().toLocaleString()}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Servicios Totales</CardTitle>
            <FileText className="h-4 w-4 text-green-medium" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{clientStats.totalServices}</div>
            <p className="text-xs text-green-medium mt-1">
              {clientStats.activeServices} activos
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Gasto Total</CardTitle>
            <DollarSign className="h-4 w-4 text-green-medium" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-medium">
              ${clientStats.totalSpent.toLocaleString()}
            </div>
            <p className="text-xs text-green-light mt-1">
              Este mes: ${clientStats.monthlySpent.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Este Mes</CardTitle>
            <Calendar className="h-4 w-4 text-green-medium" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {clientStats.completedThisMonth}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Servicios completados
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pagos Pendientes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-500">
              ${clientStats.pendingPayments.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              2 facturas pendientes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-green-dark/20 bg-green-dark/5 hover:bg-green-dark/10 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-light">
              <CheckCircle className="h-5 w-5 text-green-medium" />
              <span>Completados</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-green-medium">{clientStats.completedThisMonth}</div>
            <p className="text-sm text-muted-foreground mt-1">Este mes</p>
          </CardContent>
        </Card>

        <Card className="border-yellow-600/20 bg-yellow-600/5 hover:bg-yellow-600/10 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-yellow-400">
              <Clock className="h-5 w-5 text-yellow-500" />
              <span>En Progreso</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-yellow-500">{clientStats.activeServices}</div>
            <p className="text-sm text-muted-foreground mt-1">Servicios activos</p>
          </CardContent>
        </Card>

        <Card className="border-blue-600/20 bg-blue-600/5 hover:bg-blue-600/10 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-blue-400">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              <span>Promedio Mensual</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-blue-500">6</div>
            <p className="text-sm text-muted-foreground mt-1">Servicios por mes</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Services */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-foreground">Servicios Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentServices.map((service) => (
              <div key={service.id} className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border/30 hover:bg-background/70 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    service.status === 'completed' ? 'bg-green-medium' :
                    service.status === 'in_progress' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`} />
                  <div>
                    <p className="font-medium text-sm text-foreground">{service.folio}</p>
                    <p className="text-xs text-muted-foreground">{service.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-medium">${service.amount.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{service.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-foreground">Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button variant="outline" className="justify-start h-12 border-green-dark/30 hover:bg-green-dark/10 hover:border-green-medium">
              <FileText className="h-5 w-5 text-green-medium mr-3" />
              <span className="font-medium">Solicitar Nuevo Servicio</span>
            </Button>
            <Button variant="outline" className="justify-start h-12 border-blue-600/30 hover:bg-blue-600/10 hover:border-blue-500">
              <Clock className="h-5 w-5 text-blue-400 mr-3" />
              <span className="font-medium">Ver Servicios Activos</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
