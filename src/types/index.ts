
export type UserRole = 'admin' | 'operator' | 'viewer' | 'client';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  full_name: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  rfc?: string;
  contact_person: string;
  created_at: string;
  updated_at: string;
}

export interface Crane {
  id: string;
  name: string;
  model: string;
  capacity: number;
  license_plate: string;
  status: 'available' | 'in_service' | 'maintenance' | 'out_of_service';
  operator_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Operator {
  id: string;
  user_id: string;
  license_number: string;
  license_expiry: string;
  phone: string;
  emergency_contact: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface ServiceType {
  id: string;
  name: string;
  description: string;
  base_price: number;
  price_per_hour?: number;
  price_per_km?: number;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  client_id: string;
  service_type_id: string;
  crane_id: string;
  operator_id: string;
  pickup_location: string;
  delivery_location: string;
  pickup_date: string;
  delivery_date?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'closed';
  total_amount?: number;
  distance_km?: number;
  duration_hours?: number;
  notes?: string;
  inspection_data?: any;
  signature?: string;
  photos?: string[];
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  service_id: string;
  client_id: string;
  invoice_number: string;
  amount: number;
  tax_amount: number;
  total_amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  due_date: string;
  created_at: string;
  updated_at: string;
}

export interface Cost {
  id: string;
  service_id?: string;
  crane_id?: string;
  category: 'fuel' | 'maintenance' | 'insurance' | 'salary' | 'other';
  description: string;
  amount: number;
  date: string;
  created_at: string;
  updated_at: string;
}
