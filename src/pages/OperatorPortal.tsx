import { useState } from 'react';
import { Service } from '@/types/services';
import { OperatorAuth } from '@/types/operator-portal';
import OperatorLogin from '@/components/operator-portal/OperatorLogin';
import ServiceInspectionForm from '@/components/operator-portal/ServiceInspectionForm';
import OperatorHeader from '@/components/operator-portal/portal/OperatorHeader';
import ServiceTabs from '@/components/operator-portal/portal/ServiceTabs';

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

  if (!operator) {
    return <OperatorLogin onLogin={handleLogin} />;
  }

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
      <OperatorHeader operator={operator} />
      
      <div className="p-6">
        <ServiceTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          assignedServices={assignedServices}
          activeServices={activeServices}
          completedServices={completedServices}
          onServiceClick={handleServiceClick}
        />
      </div>
    </div>
  );
}
