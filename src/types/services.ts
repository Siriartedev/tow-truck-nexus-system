
export interface Service {
  id: string;
  folio: string;
  client_id: string;
  client_name: string;
  service_type_id: string;
  service_type_name: string;
  crane_id: string;
  crane_name: string;
  operator_id: string;
  operator_name: string;
  request_date: string;
  service_date: string;
  pickup_location: string;
  delivery_location: string;
  vehicle_brand?: string;
  vehicle_model?: string;
  license_plate?: string;
  purchase_order?: string;
  service_value: number;
  operator_commission: number;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  observations?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateServiceData {
  folio?: string;
  client_id: string;
  service_type_id: string;
  crane_id: string;
  operator_id: string;
  request_date: string;
  service_date: string;
  pickup_location: string;
  delivery_location: string;
  vehicle_brand?: string;
  vehicle_model?: string;
  license_plate?: string;
  purchase_order?: string;
  service_value: number;
  operator_commission: number;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  observations?: string;
}
