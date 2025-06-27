
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
  FileText,
  DollarSign,
  Calendar,
  Users,
  CheckCircle
} from 'lucide-react';
import CreateClosureForm from '@/components/closures/CreateClosureForm';
import type { Closure, CreateClosureData } from '@/types/closures';

export default function Closures() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Mock data
  const closures: Closure[] = [
    {
      id: '1',
      folio: 'CIE-20241220-001',
      client_id: '1',
      client_name: 'Constructora ABC',
      start_date: '2024-12-01',
      end_date: '2024-12-15',
      services_count: 5,
      total_value: 750000,
      total_commission: 75000,
      status: 'closed',
      observations: 'Cierre quincenal según contrato',
      created_at: '2024-12-16T10:00:00Z',
      updated_at: '2024-12-16T10:00:00Z',
      services: ['1', '2', '3', '4', '5']
    },
    {
      id: '2',
      folio: 'CIE-20241218-002',
      client_id: '2',
      client_name: 'Empresa XYZ',
      start_date: '2024-12-10',
      end_date: '2024-12-17',
      services_count: 3,
      total_value: 430000,
      total_commission: 43000,
      status: 'open',
      observations: 'Pendiente de validación de servicios',
      created_at: '2024-12-18T14:30:00Z',
      updated_at: '2024-12-18T14:30:00Z',
      services: ['6', '7', '8']
    },
    {
      id: '3',
      folio: 'CIE-20241215-003',
      client_id: '3',
      client_name: 'Transportes Norte',
      start_date: '2024-12-01',
      end_date: '2024-12-14',
      services_count: 8,
      total_value: 1200000,
      total_commission: 120000,
      status: 'closed',
      created_at: '2024-12-15T09:15:00Z',
      updated_at: '2024-12-15T09:15:00Z',
      services: ['9', '10', '11', '12', '13', '14', '15', '16']
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'closed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'open': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'closed': return 'Cerrado';
      case 'open': return 'Abierto';
      default: return status;
    }
  };

  const handleCreateClosure = (data: CreateClosureData) => {
    console.log('Creating closure:', data);
    toast({
      title: "Cierre creado",
      description: "El cierre ha sido creado exitosamente.",
    });
    setShowCreateForm(false);
  };

  const filteredClosures = closures.filter(closure =>
    closure.folio.toLowerCase().includes(searchTerm.toLowerCase()) ||
    closure.client_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openClosures = closures.filter(c => c.status === 'open').length;
  const closedClosures = closures.filter(c => c.status === 'closed').length;
  const totalValue = closures.reduce((sum, c) => sum + c.total_value, 0);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Cierres</h1>
          <p className="text-muted-foreground mt-1">Gestiona los cierres de servicios por cliente y período</p>
        </div>
        <Button 
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
          onClick={() => setShowCreateForm(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Cierre
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
                <p className="text-sm font-medium text-muted-foreground">Total Cierres</p>
                <p className="text-2xl font-bold text-foreground">{closures.length}</p>
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
                <p className="text-sm font-medium text-muted-foreground">Abiertos</p>
                <p className="text-2xl font-bold text-foreground">{openClosures}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Cerrados</p>
                <p className="text-2xl font-bold text-foreground">{closedClosures}</p>
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
                  ${totalValue.toLocaleString()}
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
                  placeholder="Buscar por folio o cliente..."
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

      {/* Closures Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredClosures.map((closure) => (
          <Card key={closure.id} className="bg-card border-border hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <CardTitle className="text-lg text-foreground">{closure.folio}</CardTitle>
                </div>
                <Badge className={getStatusColor(closure.status)}>
                  {getStatusText(closure.status)}
                </Badge>
              </div>
              <p className="text-sm font-medium text-foreground">{closure.client_name}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                {new Date(closure.start_date).toLocaleDateString('es-ES')} - {new Date(closure.end_date).toLocaleDateString('es-ES')}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="h-4 w-4 mr-2" />
                {closure.services_count} servicios incluidos
              </div>
              {closure.observations && (
                <div className="text-sm text-muted-foreground">
                  <strong>Observaciones:</strong> {closure.observations}
                </div>
              )}
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="text-sm">
                  <p className="font-bold text-primary">
                    ${closure.total_value.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Comisión: ${closure.total_commission.toLocaleString()}
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

      {/* Create Closure Form Modal */}
      {showCreateForm && (
        <CreateClosureForm
          onClose={() => setShowCreateForm(false)}
          onSubmit={handleCreateClosure}
        />
      )}
    </div>
  );
}
