
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Settings, Edit, Trash2 } from 'lucide-react';
import CreateServiceTypeForm from '@/components/service-types/CreateServiceTypeForm';
import type { ServiceType } from '@/types/service-types';

export default function ServiceTypes() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  // Mock data - en producción vendría de la API
  const serviceTypes: ServiceType[] = [
    {
      id: '1',
      name: 'Montaje Industrial',
      description: 'Servicio de montaje de estructuras industriales',
      base_price: 150000,
      is_active: true,
      requires_vehicle_info: false,
      required_fields: {
        order_number: true,
        origin: true,
        destination: true,
        crane: true,
        operator: true,
        vehicle_info: {
          make: false,
          model: false,
          license_plate: false
        }
      },
      created_at: '2024-01-15',
      updated_at: '2024-01-15'
    },
    {
      id: '2',
      name: 'Rescate Vehicular',
      description: 'Servicio de rescate y traslado de vehículos',
      base_price: 80000,
      is_active: true,
      requires_vehicle_info: true,
      required_fields: {
        order_number: false,
        origin: true,
        destination: true,
        crane: true,
        operator: true,
        vehicle_info: {
          make: true,
          model: true,
          license_plate: true
        }
      },
      created_at: '2024-01-10',
      updated_at: '2024-01-10'
    }
  ];

  if (showCreateForm) {
    return (
      <CreateServiceTypeForm 
        onBack={() => setShowCreateForm(false)}
        onSave={(data) => {
          console.log('Saving service type:', data);
          setShowCreateForm(false);
        }}
      />
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Tipos de Servicios</h1>
          <p className="text-muted-foreground">
            Gestiona los diferentes tipos de servicios disponibles
          </p>
        </div>
        <Button 
          onClick={() => setShowCreateForm(true)}
          className="bg-gradient-green hover:bg-gradient-green-hover"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Tipo de Servicio
        </Button>
      </div>

      {/* Service Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {serviceTypes.map((serviceType) => (
          <Card key={serviceType.id} className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg text-foreground mb-1">
                    {serviceType.name}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      serviceType.is_active 
                        ? 'bg-green-dark/20 text-green-medium border border-green-dark/30' 
                        : 'bg-red-600/20 text-red-400 border border-red-600/30'
                    }`}>
                      {serviceType.is_active ? 'Activo' : 'Inactivo'}
                    </span>
                    {serviceType.requires_vehicle_info && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-600/20 text-blue-400 border border-blue-600/30">
                        Vehículo Opcional
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-400">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {serviceType.description}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Precio Base:</span>
                <span className="text-lg font-semibold text-green-medium">
                  ${serviceType.base_price.toLocaleString()} CLP
                </span>
              </div>

              <div className="border-t border-border/30 pt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Campos Requeridos:</span>
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex flex-wrap gap-1">
                  {serviceType.required_fields.order_number && (
                    <span className="px-2 py-1 bg-accent/50 text-accent-foreground text-xs rounded">
                      Orden
                    </span>
                  )}
                  {serviceType.required_fields.origin && (
                    <span className="px-2 py-1 bg-accent/50 text-accent-foreground text-xs rounded">
                      Origen
                    </span>
                  )}
                  {serviceType.required_fields.destination && (
                    <span className="px-2 py-1 bg-accent/50 text-accent-foreground text-xs rounded">
                      Destino
                    </span>
                  )}
                  {serviceType.required_fields.crane && (
                    <span className="px-2 py-1 bg-accent/50 text-accent-foreground text-xs rounded">
                      Grúa
                    </span>
                  )}
                  {serviceType.required_fields.operator && (
                    <span className="px-2 py-1 bg-accent/50 text-accent-foreground text-xs rounded">
                      Operador
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
