
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Clock, 
  CheckCircle, 
  ArrowLeft,
  User,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Truck
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Service } from '@/types/services';
import { OperatorAuth } from '@/types/operator-portal';
import OperatorLogin from '@/components/operator-portal/OperatorLogin';
import ServiceInspectionForm from '@/components/operator-portal/ServiceInspectionForm';

// Mock data - En producción vendría de la API
const mockOperator: OperatorAuth = {
  id: '1',
  name: 'Juan Carlos Pérez',
  email: 'juan.perez@empresa.com',
  phone: '+52 55 1234 5678'
};

const mockAssignedServices: Service[] = [
  {
    id: '1',
    folio: 'SRV-2024-001',
    client_id: '1',
    client_name: 'Constructora ABC S.A.',
    service_type_id: '1',
    service_type_name: 'Traslado de Vehículo',
    crane_id: '1',
    crane_name: 'Grúa Mercedes-Benz',
    operator_id: '1',
    operator_name: 'Juan Carlos Pérez',
    request_date: '2024-01-15',
    service_date: '2024-01-15',
    pickup_location: 'Av. Insurgentes Sur 123, CDMX',
    delivery_location: 'Calz. de Tlalpan 456, CDMX',
    vehicle_brand: 'Toyota',
    vehicle_model: 'Corolla',
    license_plate: 'ABC-123-XYZ',
    service_value: 2500,
    operator_commission: 500,
    status: 'pending',
    observations: 'Vehículo con daño menor en parachoques',
    created_at: '2024-01-15T08:00:00Z',
    updated_at: '2024-01-15T08:00:00Z'
  },
  {
    id: '2',
    folio: 'SRV-2024-002',
    client_id: '2',
    client_name: 'Empresa XYZ',
    service_type_id: '1',
    service_type_name: 'Traslado de Vehículo',
    crane_id: '1',
    crane_name: 'Grúa Mercedes-Benz',
    operator_id: '1',
    operator_name: 'Juan Carlos Pérez',
    request_date: '2024-01-16',
    service_date: '2024-01-16',
    pickup_location: 'Polanco, CDMX',
    delivery_location: 'Santa Fe, CDMX',
    vehicle_brand: 'Honda',
    vehicle_model: 'Civic',
    license_plate: 'DEF-456-ABC',
    service_value: 3000,
    operator_commission: 600,
    status: 'in_progress',
    created_at: '2024-01-16T09:00:00Z',
    updated_at: '2024-01-16T09:30:00Z'
  }
];

export default function OperatorPortal() {
  const [activeTab, setActiveTab] = useState('assigned');
  const [operator, setOperator] = useState<OperatorAuth | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const navigate = useNavigate();

  // Filtrar servicios por estado
  const assignedServices = mockAssignedServices.filter(s => s.status === 'pending');
  const activeServices = mockAssignedServices.filter(s => s.status === 'in_progress');
  const completedServices = mockAssignedServices.filter(s => s.status === 'completed');

  const handleLogin = (operatorData: OperatorAuth) => {
    setOperator(operatorData);
  };

  const handleServiceClick = (service: Service) => {
    setSelectedService(service);
  };

  const handleBackToServices = () => {
    setSelectedService(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Asignado</Badge>;
      case 'in_progress':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">En Progreso</Badge>;
      case 'completed':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Completado</Badge>;
      default:
        return <Badge variant="secondary">Desconocido</Badge>;
    }
  };

  const ServiceCard = ({ service }: { service: Service }) => (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleServiceClick(service)}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">
              {service.folio}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{service.client_name}</p>
          </div>
          {getStatusBadge(service.status)}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{new Date(service.service_date).toLocaleDateString('es-MX')}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Truck className="h-4 w-4 mr-2" />
            <span>{service.vehicle_brand} {service.vehicle_model} - {service.license_plate}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2" />
            <span className="line-clamp-1">{service.pickup_location}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2" />
            <span className="line-clamp-1">{service.delivery_location}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Si no hay operador logueado, mostrar login
  if (!operator) {
    return <OperatorLogin onLogin={handleLogin} />;
  }

  // Si hay un servicio seleccionado, mostrar formulario de inspección
  if (selectedService) {
    return (
      <ServiceInspectionForm 
        service={selectedService} 
        operator={operator}
        onBack={handleBackToServices}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-green shadow-sm border-b border-green-darker/20 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-black hover:bg-white/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Sistema
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-black">Portal del Operador</h1>
              <p className="text-sm text-black/80">{operator.name}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-black">
            <User className="h-4 w-4" />
            <span className="text-sm">{operator.name}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="assigned" className="flex items-center space-x-2">
              <Home className="h-4 w-4" />
              <span>Asignados ({assignedServices.length})</span>
            </TabsTrigger>
            <TabsTrigger value="active" className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Activos ({activeServices.length})</span>
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4" />
              <span>Completados ({completedServices.length})</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="assigned">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {assignedServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
              {assignedServices.length === 0 && (
                <div className="col-span-full text-center py-8">
                  <p className="text-muted-foreground">No tienes servicios asignados</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="active">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {activeServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
              {activeServices.length === 0 && (
                <div className="col-span-full text-center py-8">
                  <p className="text-muted-foreground">No tienes servicios activos</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="completed">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {completedServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
              {completedServices.length === 0 && (
                <div className="col-span-full text-center py-8">
                  <p className="text-muted-foreground">No tienes servicios completados</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
