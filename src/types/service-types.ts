
export interface ServiceType {
  id: string;
  name: string;
  description: string;
  base_price: number;
  is_active: boolean;
  requires_vehicle_info: boolean;
  required_fields: RequiredFieldsConfig;
  created_at: string;
  updated_at: string;
}

export interface RequiredFieldsConfig {
  order_number: boolean;
  origin: boolean;
  destination: boolean;
  crane: boolean;
  operator: boolean;
  vehicle_info: VehicleInfoConfig;
}

export interface VehicleInfoConfig {
  make: boolean;
  model: boolean;
  license_plate: boolean;
}

export interface CreateServiceTypeData {
  name: string;
  description: string;
  base_price: number;
  is_active: boolean;
  requires_vehicle_info: boolean;
  required_fields: RequiredFieldsConfig;
}
