
export interface PDFDocument {
  id: string;
  name: string;
  type: 'invoice' | 'service_report' | 'certificate' | 'financial_report';
  service_id?: string;
  invoice_id?: string;
  closure_id?: string;
  file_url: string;
  file_size: number;
  created_at: string;
  updated_at: string;
}

export interface PDFGenerationOptions {
  includePhotos?: boolean;
  includeSignatures?: boolean;
  watermark?: string;
  customTemplate?: string;
}

export interface PDFTemplate {
  id: string;
  name: string;
  type: 'invoice' | 'service_report' | 'certificate';
  template_data: Record<string, any>;
  is_default: boolean;
  created_at: string;
}
