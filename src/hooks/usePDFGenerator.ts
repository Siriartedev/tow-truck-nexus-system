
import { toast } from 'sonner';
import { generateInvoicePDF } from '@/lib/pdf-generators/invoice-pdf';
import { generateServiceReportPDF } from '@/lib/pdf-generators/service-report-pdf';
import { generateCertificatePDF } from '@/lib/pdf-generators/certificate-pdf';
import { generateClientReportPDF } from '@/lib/pdf-generators/client-report-pdf';
import { generateServicesReportPDF } from '@/lib/pdf-generators/services-report-pdf';
import { generateFinancialReportPDF } from '@/lib/pdf-generators/financial-report-pdf';
import { generateOperatorsReportPDF } from '@/lib/pdf-generators/operators-report-pdf';
import { generateCranesReportPDF } from '@/lib/pdf-generators/cranes-report-pdf';
import type { Invoice } from '@/types/invoices';
import type { Service } from '@/types/services';
import type { ServiceInspection } from '@/types/operator-portal';
import type { CompanyConfig } from '@/types/configuration';
import type { 
  ClientReportData, 
  ServiceReportItem, 
  FinancialReportData, 
  OperatorReportData, 
  CraneReportData 
} from '@/types/reports';

// Configuración de empresa por defecto
const getDefaultCompanyConfig = (): CompanyConfig => ({
  id: '1',
  name: 'GRÚAS 5 NORTE',
  rut: '76.769.841-0',
  address: 'Panamericana Norte Km. 841, Copiapó',
  phone: '+56 9 62380627',
  email: 'asistencia@gruas5norte.cl',
  folio_format: 'GRU-{YYYY}-{NNNN}',
  next_folio: 1001,
  logo_url: undefined,
  created_at: '',
  updated_at: ''
});

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
      const config = companyConfig || getDefaultCompanyConfig();
      const blob = await generateCertificatePDF(service, inspection, config);
      const filename = `Certificado_${service.folio}_${service.client_name.replace(/\s+/g, '_')}.pdf`;
      downloadBlob(blob, filename);
      toast.success('Certificado generado exitosamente');
    } catch (error) {
      console.error('Error generating certificate PDF:', error);
      toast.error('Error al generar el certificado');
    }
  };

  const generateClientReport = async (
    reportData: ClientReportData, 
    filters: { date_from: string; date_to: string },
    companyConfig?: CompanyConfig
  ) => {
    try {
      toast.info('Generando reporte por cliente...');
      const config = companyConfig || getDefaultCompanyConfig();
      const blob = generateClientReportPDF(reportData, filters, config);
      const filename = `Reporte_Cliente_${reportData.client_name.replace(/\s+/g, '_')}_${filters.date_from}_${filters.date_to}.pdf`;
      downloadBlob(blob, filename);
      toast.success('Reporte por cliente generado exitosamente');
    } catch (error) {
      console.error('Error generating client report PDF:', error);
      toast.error('Error al generar el reporte por cliente');
    }
  };

  const generateServicesReport = async (
    services: ServiceReportItem[],
    filters: { date_from: string; date_to: string },
    companyConfig?: CompanyConfig
  ) => {
    try {
      toast.info('Generando reporte de servicios...');
      const config = companyConfig || getDefaultCompanyConfig();
      const blob = generateServicesReportPDF(services, filters, config);
      const filename = `Reporte_Servicios_${filters.date_from}_${filters.date_to}.pdf`;
      downloadBlob(blob, filename);
      toast.success('Reporte de servicios generado exitosamente');
    } catch (error) {
      console.error('Error generating services report PDF:', error);
      toast.error('Error al generar el reporte de servicios');
    }
  };

  const generateFinancialReport = async (
    reportData: FinancialReportData,
    companyConfig?: CompanyConfig
  ) => {
    try {
      toast.info('Generando reporte financiero...');
      const config = companyConfig || getDefaultCompanyConfig();
      const blob = generateFinancialReportPDF(reportData, config);
      const filename = `Reporte_Financiero_${reportData.period.replace(/\s+/g, '_')}.pdf`;
      downloadBlob(blob, filename);
      toast.success('Reporte financiero generado exitosamente');
    } catch (error) {
      console.error('Error generating financial report PDF:', error);
      toast.error('Error al generar el reporte financiero');
    }
  };

  const generateOperatorsReport = async (
    operators: OperatorReportData[],
    companyConfig?: CompanyConfig
  ) => {
    try {
      toast.info('Generando reporte de operadores...');
      const config = companyConfig || getDefaultCompanyConfig();
      const blob = generateOperatorsReportPDF(operators, config);
      const filename = `Reporte_Operadores_${new Date().toISOString().split('T')[0]}.pdf`;
      downloadBlob(blob, filename);
      toast.success('Reporte de operadores generado exitosamente');
    } catch (error) {
      console.error('Error generating operators report PDF:', error);
      toast.error('Error al generar el reporte de operadores');
    }
  };

  const generateCranesReport = async (
    cranes: CraneReportData[],
    companyConfig?: CompanyConfig
  ) => {
    try {
      toast.info('Generando reporte de grúas...');
      const config = companyConfig || getDefaultCompanyConfig();
      const blob = generateCranesReportPDF(cranes, config);
      const filename = `Reporte_Gruas_${new Date().toISOString().split('T')[0]}.pdf`;
      downloadBlob(blob, filename);
      toast.success('Reporte de grúas generado exitosamente');
    } catch (error) {
      console.error('Error generating cranes report PDF:', error);
      toast.error('Error al generar el reporte de grúas');
    }
  };

  return {
    generateInvoice,
    generateServiceReport,
    generateCertificate,
    generateClientReport,
    generateServicesReport,
    generateFinancialReport,
    generateOperatorsReport,
    generateCranesReport
  };
}
