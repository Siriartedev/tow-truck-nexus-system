
export interface Cost {
  id: string;
  date: string;
  amount: number;
  description: string;
  category: string;
  crane_id?: string;
  operator_id?: string;
  service_id?: string;
  service_folio?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCostData {
  date: string;
  amount: number;
  description: string;
  category: string;
  crane_id?: string;
  operator_id?: string;
  service_id?: string;
  service_folio?: string;
  notes?: string;
}

export interface CostCategory {
  id: string;
  name: string;
  description?: string;
}
