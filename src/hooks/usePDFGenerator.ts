import { toast } from 'sonner';
import { generateInvoicePDF } from '@/lib/pdf-generators/invoice-pdf';
import { generateServiceReportPDF } from '@/lib/pdf-generators/service-report-pdf';
import { generateCertificatePDF } from '@/lib/pdf-generators/certificate-pdf';
import type { Invoice } from '@/types/invoices';
import type { Service } from '@/types/services';
import type { ServiceInspection } from '@/types/operator-portal';
import type { CompanyConfig } from '@/types/configuration';

export function usePDFGenerator() {
  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateInvoice = async (invoice: Invoice) => {
    try {
      toast.info('Generando factura PDF...');
      const blob = generateInvoicePDF(invoice);
      const filename = `Factura_${invoice.folio}_${invoice.client_name.replace(/\s+/g, '_')}.pdf`;
      downloadBlob(blob, filename);
      toast.success('Factura PDF generada exitosamente');
    } catch (error) {
      console.error('Error generating invoice PDF:', error);
      toast.error('Error al generar la factura PDF');
    }
  };

  const generateServiceReport = async (service: Service, inspection?: ServiceInspection) => {
    try {
      toast.info('Generando reporte de servicio...');
      const blob = generateServiceReportPDF(service, inspection);
      const filename = `Reporte_${service.folio}_${service.client_name.replace(/\s+/g, '_')}.pdf`;
      downloadBlob(blob, filename);
      toast.success('Reporte de servicio generado exitosamente');
    } catch (error) {
      console.error('Error generating service report PDF:', error);
      toast.error('Error al generar el reporte de servicio');
    }
  };

  const generateCertificate = async (service: Service, inspection: ServiceInspection, companyConfig?: CompanyConfig) => {
    try {
      toast.info('Generando certificado...');
      const blob = await generateCertificatePDF(service, inspection, companyConfig);
      const filename = `Certificado_${service.folio}_${service.client_name.replace(/\s+/g, '_')}.pdf`;
      downloadBlob(blob, filename);
      toast.success('Certificado generado exitosamente');
    } catch (error) {
      console.error('Error generating certificate PDF:', error);
      toast.error('Error al generar el certificado');
    }
  };

  return {
    generateInvoice,
    generateServiceReport,
    generateCertificate
  };
}
