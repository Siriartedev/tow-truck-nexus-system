
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Search, 
  Plus, 
  Filter,
  Calendar,
  DollarSign,
  Edit,
  Trash2,
  FileText
} from 'lucide-react';
import CreateCostForm from '@/components/costs/CreateCostForm';

export default function Costs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Mock data
  const costs = [
    {
      id: '1',
      date: '2024-01-15',
      amount: 1500,
      description: 'Combustible para grúa',
      category: 'Combustible',
      crane_id: '1',
      crane_name: 'Grúa Liebherr LTM 1050',
      service_folio: 'F-1234',
      notes: 'Tanque lleno para servicio especial'
    },
    {
      id: '2',
      date: '2024-01-18',
      amount: 850,
      description: 'Mantenimiento preventivo',
      category: 'Mantenimiento',
      operator_id: '1',
      operator_name: 'Juan Pérez',
      notes: 'Cambio de aceite y filtros'
    },
    {
      id: '3',
      date: '2024-01-20',
      amount: 2300,
      description: 'Reparación sistema hidráulico',
      category: 'Reparación',
      crane_id: '2',
      crane_name: 'Grúa Tadano GT-550E',
      service_folio: 'F-1245',
      notes: 'Reemplazo de mangueras hidráulicas'
    }
  ];

  const handleCreateCost = (data: any) => {
    console.log('New cost data:', data);
    // Here you would typically add the cost to your state or send to API
  };

  const totalCosts = costs.reduce((sum, cost) => sum + cost.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Costos</h1>
          <p className="text-muted-foreground mt-1">Gestión de costos operativos</p>
        </div>
        <Button 
          className="bg-gradient-green hover:bg-gradient-green-hover"
          onClick={() => setShowCreateForm(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Costo
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card/50 backdrop-blur-sm border-green-dark/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center text-foreground">
              <DollarSign className="h-5 w-5 mr-2 text-green-medium" />
              Total del Mes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-medium">
              ${totalCosts.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-green-dark/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center text-foreground">
              <FileText className="h-5 w-5 mr-2 text-green-medium" />
              Registros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {costs.length}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-green-dark/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center text-foreground">
              <Calendar className="h-5 w-5 mr-2 text-green-medium" />
              Promedio Diario
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              ${Math.round(totalCosts / 30).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-card/50 backdrop-blur-sm border-green-dark/20">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar costos..."
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

      {/* Costs List */}
      <div className="space-y-4">
        {costs.map((cost) => (
          <Card key={cost.id} className="card bg-card/50 backdrop-blur-sm border-green-dark/20">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-foreground">{cost.description}</h3>
                    <div className="text-xl font-bold text-green-medium">
                      ${cost.amount.toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Fecha:</span>
                      <p className="font-medium text-foreground">{cost.date}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Categoría:</span>
                      <p className="font-medium text-foreground">{cost.category}</p>
                    </div>
                    {cost.crane_name && (
                      <div>
                        <span className="text-muted-foreground">Grúa:</span>
                        <p className="font-medium text-foreground">{cost.crane_name}</p>
                      </div>
                    )}
                    {cost.operator_name && (
                      <div>
                        <span className="text-muted-foreground">Operador:</span>
                        <p className="font-medium text-foreground">{cost.operator_name}</p>
                      </div>
                    )}
                    {cost.service_folio && (
                      <div>
                        <span className="text-muted-foreground">Folio:</span>
                        <p className="font-medium text-foreground">{cost.service_folio}</p>
                      </div>
                    )}
                  </div>

                  {cost.notes && (
                    <div className="mt-3 pt-3 border-t border-green-dark/20">
                      <span className="text-muted-foreground text-sm">Notas:</span>
                      <p className="text-sm text-foreground mt-1">{cost.notes}</p>
                    </div>
                  )}
                </div>

                <div className="flex space-x-2 ml-4">
                  <Button size="sm" variant="outline" className="border-green-dark/20 hover:bg-green-light/10">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-500 hover:text-red-600 border-red-500/20 hover:bg-red-500/10">
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
        <Button variant="outline" size="sm" className="border-green-dark/20 text-foreground hover:bg-green-light/10">Anterior</Button>
        <Button size="sm" className="bg-gradient-green hover:bg-gradient-green-hover">1</Button>
        <Button variant="outline" size="sm" className="border-green-dark/20 text-foreground hover:bg-green-light/10">2</Button>
        <Button variant="outline" size="sm" className="border-green-dark/20 text-foreground hover:bg-green-light/10">Siguiente</Button>
      </div>

      {/* Create Cost Form Modal */}
      {showCreateForm && (
        <CreateCostForm
          onClose={() => setShowCreateForm(false)}
          onSubmit={handleCreateCost}
        />
      )}
    </div>
  );
}
