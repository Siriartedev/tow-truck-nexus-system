
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  Truck
} from 'lucide-react';

export default function Services() {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  const services = [
    {
      id: '1',
      client: 'Constructora ABC',
      serviceType: 'Montaje Industrial',
      crane: 'Grúa 001 - Liebherr',
      operator: 'Juan Pérez',
      pickupLocation: 'Av. Industrial 123',
      deliveryLocation: 'Polígono Industrial Norte',
      date: '2024-01-20',
      status: 'in_progress',
      amount: 5000
    },
    {
      id: '2',
      client: 'Empresa XYZ',
      serviceType: 'Rescate Vehicular',
      crane: 'Grúa 002 - Tadano',
      operator: 'María García',
      pickupLocation: 'Carretera Nacional Km 15',
      deliveryLocation: 'Taller Mecánico Central',
      date: '2024-01-19',
      status: 'completed',
      amount: 1200
    },
    // ... more services
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Servicios</h1>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Servicio
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar servicios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Services Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {services.map((service) => (
          <Card key={service.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{service.client}</CardTitle>
                <Badge className={getStatusColor(service.status)}>
                  {getStatusText(service.status)}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">{service.serviceType}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <Truck className="h-4 w-4 mr-2" />
                {service.crane}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <User className="h-4 w-4 mr-2" />
                {service.operator}
              </div>
              <div className="flex items-start text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium">De: {service.pickupLocation}</p>
                  <p>A: {service.deliveryLocation}</p>
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                {service.date}
              </div>
              <div className="flex items-center justify-between pt-3 border-t">
                <span className="text-lg font-bold text-green-600">
                  ${service.amount.toLocaleString()}
                </span>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
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
        <Button variant="outline" size="sm">Anterior</Button>
        <Button size="sm" className="bg-green-600">1</Button>
        <Button variant="outline" size="sm">2</Button>
        <Button variant="outline" size="sm">3</Button>
        <Button variant="outline" size="sm">Siguiente</Button>
      </div>
    </div>
  );
}
