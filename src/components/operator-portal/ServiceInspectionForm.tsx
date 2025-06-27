import { useState } from 'react';
import { Service } from '@/types/services';
import { OperatorAuth, ServiceInspection, DEFAULT_INSPECTION_ITEMS } from '@/types/operator-portal';
import InspectionHeader from './inspection/InspectionHeader';
import ServiceDetails from './inspection/ServiceDetails';
import InspectionTabs from './inspection/InspectionTabs';
import { toast } from 'sonner';
import { usePDFGenerator } from '@/hooks/usePDFGenerator';

interface ServiceInspectionFormProps {
  service: Service;
  operator: OperatorAuth;
  onBack: () => void;
}

// Configuración de empresa - en un caso real vendría de la base de datos
const getCompanyConfig = () => ({
  id: '1',
  name: 'GRÚAS 5 NORTE',
  rut: '76.769.841-0',
  address: 'Panamericana Norte Km. 841, Copiapó',
  phone: '+56 9 62380627',
  email: 'asistencia@gruas5norte.cl',
  folio_format: 'GRU-{YYYY}-{NNNN}',
  next_folio: 1001,
  logo_url: undefined, // Se puede configurar en la configuración de empresa
  created_at: '',
  updated_at: ''
});

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

  const { generateServiceReport, generateCertificate } = usePDFGenerator();

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
      
      // Obtener configuración de empresa
      const companyConfig = getCompanyConfig();
      
      // Generate PDFs automatically with company config
      toast.info('Generando documentos del servicio...');
      
      // Generate service report
      await generateServiceReport(service, updatedInspection);
      
      // Generate certificate with company config
      if (updatedInspection.signatures.operator && updatedInspection.signatures.client) {
        await generateCertificate(service, updatedInspection, companyConfig);
      }
      
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
