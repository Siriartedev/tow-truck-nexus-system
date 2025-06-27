
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save } from 'lucide-react';
import { Service } from '@/types/services';
import { OperatorAuth } from '@/types/operator-portal';

interface InspectionHeaderProps {
  service: Service;
  operator: OperatorAuth;
  isFormValid: boolean;
  onBack: () => void;
  onComplete: () => void;
}

export default function InspectionHeader({ 
  service, 
  operator, 
  isFormValid, 
  onBack, 
  onComplete 
}: InspectionHeaderProps) {
  return (
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
        <div className="flex items-center space-x-4">
          <Badge variant="secondary" className="bg-white/20 text-black">
            {service.status === 'pending' ? 'Pendiente' : 'En Progreso'}
          </Badge>
          <Button 
            onClick={onComplete}
            size="sm"
            disabled={!isFormValid}
            className={`${
              isFormValid 
                ? 'bg-white text-green-700 hover:bg-gray-100' 
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            <Save className="h-4 w-4 mr-2" />
            Completar
          </Button>
        </div>
      </div>
    </header>
  );
}
