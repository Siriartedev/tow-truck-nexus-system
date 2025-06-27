
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Clock, 
  MapPin, 
  Truck, 
  User, 
  Phone,
  MessageCircle,
  Eye
} from 'lucide-react';

export default function ActiveServices() {
  // Mock data
  const activeServices = [
    {
      id: '1',
      folio: 'SRV-20241220-3390',
      service_type: 'Montaje Industrial',
      status: 'in_progress',
      progress: 65,
      estimated_completion: '2024-12-22T15:00:00Z',
      pickup_location: 'Av. Industrial 123, Monterrey, NL',
      delivery_location: 'Polígono Industrial Norte, Sector 5',
      crane: 'Grúa Liebherr LTM 1050',
      operator: {
        name: 'Juan Pérez',
        phone: '+52 81 1234 5678'
      },
      last_update: '2024-12-22T10:30:00Z',
      updates: [
        { time: '08:00', message: 'Servicio iniciado - Equipo en camino' },
        { time: '09:15', message: 'Llegada al punto de recogida' },
        { time: '10:30', message: 'Carga completada, en tránsito' }
      ]
    },
    {
      id: '2',
      folio: 'SRV-20241221-4820',
      service_type: 'Rescate Vehicular',
      status: 'pending',
      progress: 0,
      estimated_completion: '2024-12-21T12:00:00Z',
      pickup_location: 'Carretera Nacional Km 25',
      delivery_location: 'Taller Central, Zona Norte',
      crane: 'Grúa Tadano GT-550E',
      operator: {
        name: 'María González',
        phone: '+52 81 9876 5432'
      },
      last_update: '2024-12-21T07:00:00Z',
      updates: [
        { time: '07:00', message: 'Servicio programado - Pendiente de inicio' }
      ]
    },
    {
      id: '3',
      folio: 'SRV-20241222-5930',
      service_type: 'Traslado de Equipo',
      status: 'in_progress',
      progress: 25,
      estimated_completion: '2024-12-22T18:00:00Z',
      pickup_location: 'Almacén Industrial, Sector B',
      delivery_location: 'Planta de Manufactura, Av. Tecnológico',
      crane: 'Grúa Grove GMK5250L',
      operator: {
        name: 'Carlos Martínez',
        phone: '+52 81 5555 4444'
      },
      last_update: '2024-12-22T08:45:00Z',
      updates: [
        { time: '08:00', message: 'Preparación del equipo' },
        { time: '08:45', message: 'Inspección previa completada' }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'pending': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'in_progress': return 'En Progreso';
      case 'pending': return 'Pendiente';
      default: return status;
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress === 0) return 'bg-blue-500';
    if (progress < 50) return 'bg-yellow-500';
    if (progress < 80) return 'bg-orange-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Servicios Activos</h2>
          <p className="text-muted-foreground mt-1">Seguimiento en tiempo real de sus servicios</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">En Progreso</p>
                <p className="text-2xl font-bold text-foreground">
                  {activeServices.filter(s => s.status === 'in_progress').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Pendientes</p>
                <p className="text-2xl font-bold text-foreground">
                  {activeServices.filter(s => s.status === 'pending').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Activos</p>
                <p className="text-2xl font-bold text-foreground">{activeServices.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Services */}
      <div className="space-y-6">
        {activeServices.map((service) => (
          <Card key={service.id} className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(service.status)}>
                      {getStatusText(service.status)}
                    </Badge>
                    <span className="font-semibold text-lg">{service.folio}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="border-border">
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Detalles
                </Button>
              </div>
              <p className="text-muted-foreground">{service.service_type}</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Progress */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Progreso del Servicio</span>
                  <span className="text-sm text-muted-foreground">{service.progress}%</span>
                </div>
                <Progress value={service.progress} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  Última actualización: {new Date(service.last_update).toLocaleString('es-ES')}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Service Details */}
                <div className="space-y-4">
                  <div className="flex items-start text-sm">
                    <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">De: {service.pickup_location}</p>
                      <p className="text-muted-foreground">A: {service.delivery_location}</p>
                    </div>
                  </div>

                  <div className="flex items-center text-sm">
                    <Truck className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{service.crane}</span>
                  </div>

                  <div className="flex items-center text-sm">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium">{service.operator.name}</span>
                  </div>

                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>
                      Finalización estimada: {new Date(service.estimated_completion).toLocaleString('es-ES')}
                    </span>
                  </div>
                </div>

                {/* Recent Updates */}
                <div>
                  <h4 className="font-medium text-sm mb-3">Actualizaciones Recientes</h4>
                  <div className="space-y-2">
                    {service.updates.slice(-3).map((update, index) => (
                      <div key={index} className="flex items-start space-x-2 text-sm">
                        <div className="w-12 text-muted-foreground font-medium">
                          {update.time}
                        </div>
                        <div className="flex-1 bg-background/50 rounded-lg p-2 border border-border/30">
                          {update.message}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contact Actions */}
              <div className="flex items-center space-x-2 pt-4 border-t border-border">
                <Button variant="outline" size="sm" className="border-green-dark/30 hover:bg-green-dark/10">
                  <Phone className="h-4 w-4 mr-2" />
                  Llamar: {service.operator.phone}
                </Button>
                <Button variant="outline" size="sm" className="border-blue-600/30 hover:bg-blue-600/10">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Enviar Mensaje
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {activeServices.length === 0 && (
        <Card className="bg-card border-border">
          <CardContent className="text-center py-12">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No hay servicios activos</h3>
            <p className="text-muted-foreground">
              Actualmente no tiene servicios en progreso o pendientes
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
