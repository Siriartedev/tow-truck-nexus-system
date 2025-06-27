
import { useState } from 'react';
import { Service } from '@/types/services';
import { OperatorAuth, ServiceInspection, DEFAULT_INSPECTION_ITEMS } from '@/types/operator-portal';
import InspectionHeader from './inspection/InspectionHeader';
import ServiceDetails from './inspection/ServiceDetails';
import InspectionTabs from './inspection/InspectionTabs';
import { toast } from 'sonner';

interface ServiceInspectionFormProps {
  service: Service;
  operator: OperatorAuth;
  onBack: () => void;
}

export default function ServiceInspectionForm({ service, operator, onBack }: ServiceInspectionFormProps) {
  const [activeTab, setActiveTab] = useState<string>('inventory');
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
      const updatedInspection = {
        ...inspection,
        completed_at: new Date().toISOString()
      };

      console.log('Inspección completada:', updatedInspection);
      
      toast.success('Inspección completada exitosamente. El servicio ahora está en progreso.');
      
      onBack();
    } catch (error) {
      toast.error('Error al completar la inspección');
      console.error('Error:', error);
    }
  };

  const isFormValid = (): boolean => {
    const hasMinimumPhotos = inspection.photos.filter(p => p.file).length >= 1;
    const hasOperatorSignature = !!inspection.signatures.operator;
    const hasClientSignature = !!inspection.signatures.client;
    
    return hasMinimumPhotos && hasOperatorSignature && hasClientSignature;
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <InspectionHeader
        service={service}
        operator={operator}
        isFormValid={isFormValid()}
        onBack={onBack}
        onComplete={handleCompleteInspection}
      />

      <ServiceDetails service={service} />

      <div className="p-6">
        <InspectionTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          inspection={inspection}
          setInspection={setInspection}
          operatorName={operator.name}
        />
      </div>
    </div>
  );
}
