
export interface Operator {
  id: string;
  full_name: string;
  rut: string;
  phone: string;
  license_number: string;
  exam_expiry_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateOperatorData {
  full_name: string;
  rut: string;
  phone: string;
  license_number: string;
  exam_expiry_date: string;
  is_active: boolean;
}
