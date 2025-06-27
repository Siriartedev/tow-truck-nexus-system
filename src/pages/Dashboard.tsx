
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Truck, 
  Users, 
  DollarSign, 
  FileText, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export default function Dashboard() {
  // Mock data - en producción vendría de la API
  const stats = {
    totalServices: 234,
    activeServices: 12,
    totalRevenue: 125000,
    monthlyRevenue: 18500,
    availableCranes: 8,
    totalCranes: 12,
    activeOperators: 15,
    totalClients: 89
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
    // ... more services
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Última actualización: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Servicios Totales</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalServices}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeServices} activos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Mensuales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.monthlyRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +12% vs mes anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Grúas Disponibles</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.availableCranes}/{stats.totalCranes}
            </div>
            <p className="text-xs text-muted-foreground">
              67% disponibilidad
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Activos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClients}</div>
            <p className="text-xs text-muted-foreground">
              +5 este mes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Services and Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Services */}
        <Card>
          <CardHeader>
            <CardTitle>Servicios Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentServices.map((service) => (
                <div key={service.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      service.status === 'completed' ? 'bg-green-500' :
                      service.status === 'in_progress' ? 'bg-yellow-500' : 'bg-gray-400'
                    }`} />
                    <div>
                      <p className="font-medium text-sm">{service.client}</p>
                      <p className="text-xs text-gray-500">{service.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${service.amount.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{service.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              <button className="flex items-center space-x-3 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                <FileText className="h-5 w-5 text-green-600" />
                <span className="font-medium">Nuevo Servicio</span>
              </button>
              <button className="flex items-center space-x-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Agregar Cliente</span>
              </button>
              <button className="flex items-center space-x-3 p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                <Truck className="h-5 w-5 text-purple-600" />
                <span className="font-medium">Registrar Grúa</span>
              </button>
              <button className="flex items-center space-x-3 p-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
                <DollarSign className="h-5 w-5 text-orange-600" />
                <span className="font-medium">Ver Reportes</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Servicios Completados</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">156</div>
            <p className="text-sm text-gray-500">Este mes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <span>En Progreso</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">12</div>
            <p className="text-sm text-gray-500">Servicios activos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span>Requieren Atención</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">3</div>
            <p className="text-sm text-gray-500">Servicios pendientes</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
