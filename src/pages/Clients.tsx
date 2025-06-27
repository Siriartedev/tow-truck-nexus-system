
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Search, 
  Plus, 
  Filter,
  Eye,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Building
} from 'lucide-react';
import CreateClientForm from '@/components/clients/CreateClientForm';

export default function Clients() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Mock data
  const clients = [
    {
      id: '1',
      name: 'Constructora ABC',
      email: 'contacto@constructoraabc.com',
      phone: '+52 81 1234-5678',
      address: 'Av. Industrial 123, Monterrey, NL',
      rfc: 'CABC123456789',
      contactPerson: 'Juan Martínez',
      totalServices: 15,
      totalAmount: 75000,
      lastService: '2024-01-15'
    },
    {
      id: '2',
      name: 'Empresa XYZ',
      email: 'info@empresaxyz.com',
      phone: '+52 81 9876-5432',
      address: 'Calle Comercio 456, San Pedro, NL',
      rfc: 'EXYZ987654321',
      contactPerson: 'María López',
      totalServices: 8,
      totalAmount: 32000,
      lastService: '2024-01-18'
    },
    // ... more clients
  ];

  const handleCreateClient = (data: any) => {
    console.log('New client data:', data);
    // Here you would typically add the client to your state or send to API
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Clientes</h1>
        <Button 
          className="bg-gradient-green hover:bg-gradient-green-hover"
          onClick={() => setShowCreateForm(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Cliente
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-card/50 backdrop-blur-sm border-green-dark/20">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar clientes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-green-dark/20 focus:border-green-medium"
                />
              </div>
            </div>
            <Button variant="outline" className="border-green-dark/20 text-foreground hover:bg-green-light/10">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {clients.map((client) => (
          <Card key={client.id} className="card bg-card/50 backdrop-blur-sm border-green-dark/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center text-foreground">
                  <Building className="h-5 w-5 mr-2 text-green-medium" />
                  {client.name}
                </CardTitle>
              </div>
              <p className="text-sm text-muted-foreground">{client.contactPerson}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center text-sm text-muted-foreground">
                <Mail className="h-4 w-4 mr-2" />
                {client.email}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Phone className="h-4 w-4 mr-2" />
                {client.phone}
              </div>
              <div className="flex items-start text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mr-2 mt-0.5" />
                <p>{client.address}</p>
              </div>
              <div className="pt-3 border-t border-green-dark/20 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Servicios:</span>
                  <span className="font-medium text-foreground">{client.totalServices}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total facturado:</span>
                  <span className="font-medium text-green-medium">
                    ${client.totalAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Último servicio:</span>
                  <span className="font-medium text-foreground">{client.lastService}</span>
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-3 border-t border-green-dark/20">
                <Button size="sm" variant="outline" className="border-green-dark/20 hover:bg-green-light/10">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" className="border-green-dark/20 hover:bg-green-light/10">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" className="text-red-500 hover:text-red-600 border-red-500/20 hover:bg-red-500/10">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center space-x-2">
        <Button variant="outline" size="sm" className="border-green-dark/20 text-foreground hover:bg-green-light/10">Anterior</Button>
        <Button size="sm" className="bg-gradient-green hover:bg-gradient-green-hover">1</Button>
        <Button variant="outline" size="sm" className="border-green-dark/20 text-foreground hover:bg-green-light/10">2</Button>
        <Button variant="outline" size="sm" className="border-green-dark/20 text-foreground hover:bg-green-light/10">3</Button>
        <Button variant="outline" size="sm" className="border-green-dark/20 text-foreground hover:bg-green-light/10">Siguiente</Button>
      </div>

      {/* Create Client Form Modal */}
      {showCreateForm && (
        <CreateClientForm
          onClose={() => setShowCreateForm(false)}
          onSubmit={handleCreateClient}
        />
      )}
    </div>
  );
}
