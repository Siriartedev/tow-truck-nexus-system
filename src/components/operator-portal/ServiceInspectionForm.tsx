
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, FileText, Camera, PenTool, Save } from 'lucide-react';
import { Service } from '@/types/services';
import { OperatorAuth, ServiceInspection, DEFAULT_INSPECTION_ITEMS } from '@/types/operator-portal';
import VehicleInventory from './VehicleInventory';
import PhotoCapture from './PhotoCapture';
import DigitalSignatures from './DigitalSignatures';
import { toast } from 'sonner';

interface ServiceInspectionFormProps {
  service: Service;
  operator: OperatorAuth;
  onBack: () => void;
}

export default function ServiceInspectionForm({ service, operator, onBack }: ServiceInspectionFormProps) {
  const [activeTab, setActiveTab] = useState('inventory');
  const [inspection, setInspection] = useState<ServiceInspection>({
    id: crypto.randomUUID(),
    service_id: service.id,
    operator_id: operator.id,
    inspection_items: DEFAULT_INSPECTION_ITEMS,
    photos: [],
    observations: '',
    client_present_name: '',
    signatures: {
      operator: null,
      client: null
    },
    created_at: new Date().toISOString()
  });

  const handleCompleteInspection = async () => {
    // Validaciones
    const hasMinimumPhotos = inspection.photos.filter(p => p.file).length >= 1;
    const hasOperatorSignature = inspection.signatures.operator;
    const hasClientSignature = inspection.signatures.client;

    if (!hasMinimumPhotos) {
      toast.error('Debes tomar al menos 1 fotografía');
      setActiveTab('photos');
      return;
    }

    if (!hasOperatorSignature) {
      toast.error('Falta la firma del operador');
      setActiveTab('signatures');
      return;
    }

    if (!hasClientSignature) {
      toast.error('Falta la firma del cliente');
      setActiveTab('signatures');
      return;
    }

    try {
      // Aquí iría la llamada a la API para:
      // 1. Guardar la inspección
      // 2. Actualizar el estado del servicio a 'in_progress'
      // 3. Subir las fotos
      
      const updatedInspection = {
        ...inspection,
        completed_at: new Date().toISOString()
      };

      console.log('Inspección completada:', updatedInspection);
      
      toast.success('Inspección completada exitosamente. El servicio ahora está en progreso.');
      
      // Volver a la lista de servicios
      onBack();
    } catch (error) {
      toast.error('Error al completar la inspección');
      console.error('Error:', error);
    }
  };

  const isFormValid = () => {
    const hasMinimumPhotos = inspection.photos.filter(p => p.file).length >= 1;
    const hasOperatorSignature = inspection.signatures.operator;
    const hasClientSignature = inspection.signatures.client;
    
    return hasMinimumPhotos && hasOperatorSignature && hasClientSignature;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-green shadow-sm border-b border-green-darker/20 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-black hover:bg-white/10" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Servicios
            </Button>
            <div>
              <h1 className="text-xl font-bold text-black">Inspección Pre-Servicio</h1>
              <p className="text-sm text-black/80">{service.folio} - {service.client_name}</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-white/20 text-black">
            {service.status === 'pending' ? 'Pendiente' : 'En Progreso'}
          </Badge>
        </div>
      </header>

      {/* Service Details */}
      <div className="p-6 bg-card border-b">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="font-medium text-muted-foreground">Cliente:</span>
            <p className="font-semibold">{service.client_name}</p>
          </div>
          <div>
            <span className="font-medium text-muted-foreground">Vehículo:</span>
            <p className="font-semibold">{service.vehicle_brand} {service.vehicle_model}</p>
            <p className="text-muted-foreground">{service.license_plate}</p>
          </div>
          <div>
            <span className="font-medium text-muted-foreground">Origen:</span>
            <p className="font-semibold line-clamp-2">{service.pickup_location}</p>
          </div>
          <div>
            <span className="font-medium text-muted-foreground">Destino:</span>
            <p className="font-semibold line-clamp-2">{service.delivery_location}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="inventory" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Inventario</span>
            </TabsTrigger>
            <TabsTrigger value="photos" className="flex items-center space-x-2">
              <Camera className="h-4 w-4" />
              <span>Fotografías</span>
            </TabsTrigger>
            <TabsTrigger value="signatures" className="flex items-center space-x-2">
              <PenTool className="h-4 w-4" />
              <span>Firmas</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inventory">
            <VehicleInventory 
              inspection={inspection}
              onUpdate={setInspection}
            />
          </TabsContent>

          <TabsContent value="photos">
            <PhotoCapture 
              inspection={inspection}
              onUpdate={setInspection}
            />
          </TabsContent>

          <TabsContent value="signatures">
            <DigitalSignatures 
              inspection={inspection}
              onUpdate={setInspection}
              operatorName={operator.name}
            />
          </TabsContent>
        </Tabs>

        {/* Complete Inspection Button */}
        <div className="fixed bottom-6 right-6">
          <Button 
            onClick={handleCompleteInspection}
            size="lg"
            disabled={!isFormValid()}
            className="shadow-lg"
          >
            <Save className="h-4 w-4 mr-2" />
            Completar Inspección
          </Button>
        </div>
      </div>
    </div>
  );
}
