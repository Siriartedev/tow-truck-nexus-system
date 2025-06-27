
import { Service } from '@/types/services';

interface ServiceDetailsProps {
  service: Service;
}

export default function ServiceDetails({ service }: ServiceDetailsProps) {
  return (
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
  );
}
