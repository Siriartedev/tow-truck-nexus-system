
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Truck } from 'lucide-react';
import { Service } from '@/types/services';

interface ServiceCardProps {
  service: Service;
  onClick: (service: Service) => void;
}

export default function ServiceCard({ service, onClick }: ServiceCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Asignado</Badge>;
      case 'in_progress':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">En Progreso</Badge>;
      case 'completed':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Completado</Badge>;
      default:
        return <Badge variant="secondary">Desconocido</Badge>;
    }
  };

  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onClick(service)}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">
              {service.folio}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{service.client_name}</p>
          </div>
          {getStatusBadge(service.status)}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{new Date(service.service_date).toLocaleDateString('es-MX')}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Truck className="h-4 w-4 mr-2" />
            <span>{service.vehicle_brand} {service.vehicle_model} - {service.license_plate}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2" />
            <span className="line-clamp-1">{service.pickup_location}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2" />
            <span className="line-clamp-1">{service.delivery_location}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
