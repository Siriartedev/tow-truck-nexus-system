
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter,
  Eye,
  Download,
  MapPin,
  Calendar,
  Truck,
  FileText
} from 'lucide-react';
import type { ClientService } from '@/types/client-portal';

export default function ServiceHistory() {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  const services: ClientService[] = [
    {
      id: '1',
      folio: 'SRV-20241220-3390',
      service_type: 'Montaje Industrial',
      status: 'completed',
      request_date: '2024-12-20',
      service_date: '2024-12-22',
      pickup_location: 'Av. Industrial 123, Monterrey, NL',
      delivery_location: 'Polígono Industrial Norte, Sector 5',
      vehicle_info: {
        brand: 'Volvo',
        model: 'FH16',
        license_plate: 'AB-CD-12',
        year: 2020
      },
      service_value: 150000,
      created_at: '2024-12-20T10:00:00Z'
    },
    {
      id: '2',
      folio: 'SRV-20241219-2850',
      service_type: 'Rescate Vehicular',
      status: 'completed',
      request_date: '2024-12-19',
      service_date: '2024-12-19',
      pickup_location: 'Carretera Nacional Km 15',
      delivery_location: 'Taller Mecánico Central',
      vehicle_info: {
        brand: 'Mercedes',
        model: 'Actros',
        license_plate: 'XY-ZW-34'
      },
      service_value: 80000,
      created_at: '2024-12-19T08:30:00Z'
    },
    {
      id: '3',
      folio: 'SRV-20241218-1750',
      service_type: 'Traslado de Equipo',
      status: 'completed',
      request_date: '2024-12-18',
      service_date: '2024-12-20',
      pickup_location: 'Almacén Central, Zona Este',
      delivery_location: 'Obra en construcción, Av. Constitución 456',
      vehicle_info: {
        brand: 'Kenworth',
        model: 'T800',
        license_plate: 'LM-NO-56'
      },
      service_value: 200000,
      created_at: '2024-12-18T14:20:00Z'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'pending': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completado';
      case 'in_progress': return 'En Progreso';
      case 'pending': return 'Pendiente';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  const filteredServices = services.filter(service =>
    service.folio.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.service_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Historial de Servicios</h2>
          <p className="text-muted-foreground mt-1">Todos sus servicios pasados y actuales</p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-3 bg-primary/10 rounded-lg">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Servicios</p>
                <p className="text-2xl font-bold text-foreground">{services.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Truck className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Completados</p>
                <p className="text-2xl font-bold text-foreground">
                  {services.filter(s => s.status === 'completed').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Badge className="h-6 w-6 text-primary" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Valor Total</p>
                <p className="text-2xl font-bold text-foreground">
                  ${services.reduce((sum, s) => sum + s.service_value, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-card border-border">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar por folio o tipo de servicio..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background border-input"
                />
              </div>
            </div>
            <Button variant="outline" className="border-border">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Services List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredServices.map((service) => (
          <Card key={service.id} className="bg-card border-border hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <CardTitle className="text-lg text-foreground">{service.folio}</CardTitle>
                </div>
                <Badge className={getStatusColor(service.status)}>
                  {getStatusText(service.status)}
                </Badge>
              </div>
              <p className="text-sm font-medium text-foreground">{service.service_type}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium">De: {service.pickup_location}</p>
                  <p>A: {service.delivery_location}</p>
                </div>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                Servicio: {new Date(service.service_date).toLocaleDateString('es-ES')}
              </div>
              <div className="text-sm text-muted-foreground">
                <strong>Vehículo:</strong> {service.vehicle_info.brand} {service.vehicle_info.model}
                {service.vehicle_info.license_plate && ` - ${service.vehicle_info.license_plate}`}
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="text-sm">
                  <p className="font-bold text-primary">
                    ${service.service_value.toLocaleString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="border-border">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="border-border">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
