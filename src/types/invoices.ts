
export interface Invoice {
  id: string;
  folio: string;
  closure_id: string;
  closure_folio: string;
  client_id: string;
  client_name: string;
  issue_date: string;
  due_date: string;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total_amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  payment_date?: string;
  observations?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateInvoiceData {
  closure_id: string;
  issue_date: string;
  due_date: string;
  tax_rate: number;
  observations?: string;
}

export interface InvoiceFilters {
  client_id?: string;
  status?: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  date_from?: string;
  date_to?: string;
}
