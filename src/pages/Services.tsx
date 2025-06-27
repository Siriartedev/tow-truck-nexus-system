
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { 
  Search, 
  Plus, 
  Filter,
  Eye,
  Edit,
  Trash2,
  MapPin,
  Calendar,
  User,
  Truck,
  FileText,
  DollarSign
} from 'lucide-react';
import CreateServiceForm from '@/components/services/CreateServiceForm';
import type { Service, CreateServiceData } from '@/types/services';

export default function Services() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Mock data
  const services: Service[] = [
    {
      id: '1',
      folio: 'SRV-20241220-3390',
      client_id: '1',
      client_name: 'Constructora ABC',
      service_type_id: '1',
      service_type_name: 'Montaje Industrial',
      crane_id: '1',
      crane_name: 'Grúa Liebherr LTM 1050',
      operator_id: '1',
      operator_name: 'Juan Pérez',
      request_date: '2024-12-20',
      service_date: '2024-12-22',
      pickup_location: 'Av. Industrial 123, Monterrey, NL',
      delivery_location: 'Polígono Industrial Norte, Sector 5',
      vehicle_brand: 'Volvo',
      vehicle_model: 'FH16',
      license_plate: 'AB-CD-12',
      purchase_order: 'OC-12345',
      service_value: 150000,
      operator_commission: 15000,
      status: 'in_progress',
      observations: 'Servicio programado para la mañana',
      created_at: '2024-12-20T10:00:00Z',
      updated_at: '2024-12-20T10:00:00Z'
    },
    {
      id: '2',
      folio: 'SRV-20241219-2850',
      client_id: '2',
      client_name: 'Empresa XYZ',
      service_type_id: '2',
      service_type_name: 'Rescate Vehicular',
      crane_id: '2',
      crane_name: 'Grúa Tadano GT-550E',
      operator_id: '2',
      operator_name: 'María González',
      request_date: '2024-12-19',
      service_date: '2024-12-19',
      pickup_location: 'Carretera Nacional Km 15',
      delivery_location: 'Taller Mecánico Central',
      service_value: 80000,
      operator_commission: 8000,
      status: 'completed',
      created_at: '2024-12-19T08:30:00Z',
      updated_at: '2024-12-19T15:45:00Z'
    },
    {
      id: '3',
      folio: 'SRV-20241218-1750',
      client_id: '3',
      client_name: 'Transportes Norte',
      service_type_id: '3',
      service_type_name: 'Traslado de Equipo',
      crane_id: '3',
      crane_name: 'Grúa Grove GMK5250L',
      operator_id: '3',
      operator_name: 'Carlos Martínez',
      request_date: '2024-12-18',
      service_date: '2024-12-20',
      pickup_location: 'Almacén Central, Zona Este',
      delivery_location: 'Obra en construcción, Av. Constitución 456',
      service_value: 200000,
      operator_commission: 20000,
      status: 'pending',
      observations: 'Requiere coordinación especial para el acceso',
      created_at: '2024-12-18T14:20:00Z',
      updated_at: '2024-12-18T14:20:00Z'
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

  const handleCreateService = (data: CreateServiceData) => {
    console.log('Creating service:', data);
    toast({
      title: "Servicio creado",
      description: "El servicio ha sido creado exitosamente.",
    });
  };

  const filteredServices = services.filter(service =>
    service.folio.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.service_type_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Servicios</h1>
          <p className="text-muted-foreground mt-1">Gestiona todos los servicios de grúa</p>
        </div>
        <Button 
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
          onClick={() => setShowCreateForm(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Servicio
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-card border-border">
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

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                <Calendar className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">En Progreso</p>
                <p className="text-2xl font-bold text-foreground">
                  {services.filter(s => s.status === 'in_progress').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
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

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-3 bg-primary/10 rounded-lg">
                <DollarSign className="h-6 w-6 text-primary" />
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
                  placeholder="Buscar por folio, cliente o tipo de servicio..."
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

      {/* Services Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
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
              <p className="text-sm font-medium text-foreground">{service.client_name}</p>
              <p className="text-sm text-muted-foreground">{service.service_type_name}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center text-sm text-muted-foreground">
                <Truck className="h-4 w-4 mr-2" />
                {service.crane_name}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <User className="h-4 w-4 mr-2" />
                {service.operator_name}
              </div>
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
              {service.vehicle_brand && service.vehicle_model && (
                <div className="text-sm text-muted-foreground">
                  <strong>Vehículo:</strong> {service.vehicle_brand} {service.vehicle_model}
                  {service.license_plate && ` - ${service.license_plate}`}
                </div>
              )}
              {service.purchase_order && (
                <div className="text-sm text-muted-foreground">
                  <strong>OC:</strong> {service.purchase_order}
                </div>
              )}
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="text-sm">
                  <p className="font-bold text-primary">
                    ${service.service_value.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Comisión: ${service.operator_commission.toLocaleString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="border-border">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="border-border">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 border-border">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center space-x-2">
        <Button variant="outline" size="sm" className="border-border">Anterior</Button>
        <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">1</Button>
        <Button variant="outline" size="sm" className="border-border">2</Button>
        <Button variant="outline" size="sm" className="border-border">3</Button>
        <Button variant="outline" size="sm" className="border-border">Siguiente</Button>
      </div>

      {/* Create Service Form Modal */}
      {showCreateForm && (
        <CreateServiceForm
          onClose={() => setShowCreateForm(false)}
          onSubmit={handleCreateService}
        />
      )}
    </div>
  );
}
