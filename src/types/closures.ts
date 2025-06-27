
export interface Closure {
  id: string;
  folio: string;
  client_id: string;
  client_name: string;
  start_date: string;
  end_date: string;
  services_count: number;
  total_value: number;
  total_commission: number;
  status: 'open' | 'closed';
  observations?: string;
  created_at: string;
  updated_at: string;
  services: string[]; // Array of service IDs
}

export interface CreateClosureData {
  client_id: string;
  start_date: string;
  end_date: string;
  service_ids: string[];
  observations?: string;
}

export interface ClosureFilters {
  client_id?: string;
  status?: 'open' | 'closed';
  date_from?: string;
  date_to?: string;
}
