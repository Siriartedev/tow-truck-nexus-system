
export interface ClientService {
  id: string;
  folio: string;
  service_type: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  request_date: string;
  service_date: string;
  pickup_location: string;
  delivery_location: string;
  vehicle_info: {
    brand: string;
    model: string;
    license_plate: string;
    year?: number;
  };
  service_value: number;
  created_at: string;
}

export interface ClientDocument {
  id: string;
  name: string;
  type: 'invoice' | 'report' | 'certificate';
  service_id: string;
  url: string;
  created_at: string;
}

export interface ClientInspection {
  id: string;
  service_id: string;
  title: string;
  description: string;
  photos: string[];
  created_at: string;
}

export interface ServiceRequestData {
  service_type_id: string;
  preferred_date: string;
  vehicle_brand: string;
  vehicle_model: string;
  vehicle_year: number;
  license_plate: string;
  pickup_location: string;
  delivery_location: string;
  additional_info: string;
  contact_phone: string;
}
