
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Truck, 
  Users, 
  DollarSign, 
  FileText, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Download,
  BarChart3,
  Calendar
} from 'lucide-react';

export default function Dashboard() {
  // Mock data - en producción vendría de la API
  const stats = {
    totalServices: 234,
    activeServices: 12,
    totalRevenue: 125000,
    monthlyRevenue: 18500,
    weeklyRevenue: 8200,
    availableCranes: 8,
    totalCranes: 12,
    activeOperators: 15,
    totalClients: 89,
    weeklyServices: 45,
    monthlyServices: 156
  };

  const recentServices = [
    {
      id: '1',
      client: 'Constructora ABC',
      type: 'Montaje Industrial',
      status: 'in_progress',
      amount: 5000,
      date: '2024-01-20'
    },
    {
      id: '2',
      client: 'Empresa XYZ',
      type: 'Rescate Vehicular',
      status: 'completed',
      amount: 1200,
      date: '2024-01-19'
    },
    {
      id: '3',
      client: 'Constructora DEF',
      type: 'Transporte Especial',
      status: 'pending',
      amount: 3500,
      date: '2024-01-18'
    }
  ];

  return (
    <div className="space-y-8 p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Reportes y Estadísticas</h1>
          <p className="text-muted-foreground">
            Última actualización: {new Date().toLocaleString()}
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="border-green-medium hover:bg-green-dark/10">
            <Download className="h-4 w-4 mr-2" />
            Exportar Datos
          </Button>
          <Button className="bg-gradient-green hover:bg-gradient-green-hover">
            <BarChart3 className="h-4 w-4 mr-2" />
            Generar Reporte
          </Button>
        </div>
      </div>

      {/* Time Period Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Clock className="h-5 w-5 text-green-medium" />
              <span>Esta Semana</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Servicios</span>
              <span className="text-2xl font-bold text-foreground">{stats.weeklyServices}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Ingresos</span>
              <span className="text-2xl font-bold text-green-medium">
                ${stats.weeklyRevenue.toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Calendar className="h-5 w-5 text-green-medium" />
              <span>Este Mes</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Servicios</span>
              <span className="text-2xl font-bold text-foreground">{stats.monthlyServices}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Ingresos</span>
              <span className="text-2xl font-bold text-green-medium">
                ${stats.monthlyRevenue.toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Servicios Totales</CardTitle>
            <FileText className="h-4 w-4 text-green-medium" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.totalServices}</div>
            <p className="text-xs text-green-medium mt-1">
              {stats.activeServices} activos
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ingresos Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-green-medium" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-medium">
              ${stats.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-green-light mt-1">
              +12% vs mes anterior
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Grúas Disponibles</CardTitle>
            <Truck className="h-4 w-4 text-green-medium" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {stats.availableCranes}/{stats.totalCranes}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              67% disponibilidad
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Clientes Activos</CardTitle>
            <Users className="h-4 w-4 text-green-medium" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.totalClients}</div>
            <p className="text-xs text-green-medium mt-1">
              +5 este mes
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
              <span>Servicios Completados</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-green-medium">{stats.monthlyServices}</div>
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
            <div className="text-4xl font-bold text-yellow-500">{stats.activeServices}</div>
            <p className="text-sm text-muted-foreground mt-1">Servicios activos</p>
          </CardContent>
        </Card>

        <Card className="border-red-600/20 bg-red-600/5 hover:bg-red-600/10 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-400">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span>Requieren Atención</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-red-500">3</div>
            <p className="text-sm text-muted-foreground mt-1">Servicios pendientes</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Services and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                      service.status === 'in_progress' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                    <div>
                      <p className="font-medium text-sm text-foreground">{service.client}</p>
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
            <div className="grid grid-cols-1 gap-3">
              <Button variant="outline" className="justify-start h-12 border-green-dark/30 hover:bg-green-dark/10 hover:border-green-medium">
                <FileText className="h-5 w-5 text-green-medium mr-3" />
                <span className="font-medium">Nuevo Servicio</span>
              </Button>
              <Button variant="outline" className="justify-start h-12 border-blue-600/30 hover:bg-blue-600/10 hover:border-blue-500">
                <Users className="h-5 w-5 text-blue-400 mr-3" />
                <span className="font-medium">Agregar Cliente</span>
              </Button>
              <Button variant="outline" className="justify-start h-12 border-purple-600/30 hover:bg-purple-600/10 hover:border-purple-500">
                <Truck className="h-5 w-5 text-purple-400 mr-3" />
                <span className="font-medium">Registrar Grúa</span>
              </Button>
              <Button variant="outline" className="justify-start h-12 border-orange-600/30 hover:bg-orange-600/10 hover:border-orange-500">
                <TrendingUp className="h-5 w-5 text-orange-400 mr-3" />
                <span className="font-medium">Ver Reportes</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
