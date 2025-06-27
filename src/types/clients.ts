
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  rfc: string;
  contact_person: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateClientData {
  name: string;
  email: string;
  phone: string;
  address: string;
  rfc: string;
  contact_person: string;
  is_active: boolean;
}
