
export interface Crane {
  id: string;
  license_plate: string;
  type: string;
  brand: string;
  model: string;
  circulation_permit_expiry: string;
  insurance_expiry: string;
  technical_revision_expiry: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateCraneData {
  license_plate: string;
  type: string;
  brand: string;
  model: string;
  circulation_permit_expiry: string;
  insurance_expiry: string;
  technical_revision_expiry: string;
  is_active: boolean;
}
