
export interface ServiceReportItem {
  id: string;
  folio: string;
  client_name: string;
  service_type: string;
  vehicle_brand: string;
  vehicle_model: string;
  license_plate: string;
  origin: string;
  destination: string;
  observations?: string;
  service_date: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  amount: number;
  operator_name: string;
}

export interface ClientReportData {
  client_id: string;
  client_name: string;
  total_services: number;
  total_amount: number;
  services: ServiceReportItem[];
}

export interface ReportFilters {
  client_id?: string;
  date_from: string;
  date_to: string;
  service_type?: string;
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
}

export interface FinancialReportData {
  period: string;
  total_revenue: number;
  total_commissions: number;
  net_profit: number;
  services_count: number;
  clients_count: number;
}

export interface OperatorReportData {
  operator_id: string;
  operator_name: string;
  services_count: number;
  total_commissions: number;
  total_revenue: number;
  performance_rating: number;
}

export interface CraneReportData {
  crane_id: string;
  crane_identifier: string;
  brand: string;
  model: string;
  services_count: number;
  utilization_percentage: number;
  total_revenue: number;
}
