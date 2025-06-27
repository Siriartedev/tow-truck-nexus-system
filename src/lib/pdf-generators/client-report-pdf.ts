
import { PDFGenerator } from '../pdf-utils';
import type { ClientReportData } from '@/types/reports';
import type { CompanyConfig } from '@/types/configuration';

export function generateClientReportPDF(
  reportData: ClientReportData,
  filters: { date_from: string; date_to: string },
  companyConfig: CompanyConfig
): Blob {
  const pdf = new PDFGenerator();
  
  // Header con datos de empresa
  if (companyConfig.logo_url) {
    try {
      pdf.addImage(companyConfig.logo_url, 60, 40);
    } catch (error) {
      console.log('Logo no disponible');
    }
  }
  
  pdf.addText(companyConfig.name, { bold: true, size: 16 });
  pdf.addText(`RUT: ${companyConfig.rut}`, { size: 10 });
  pdf.addText(companyConfig.address, { size: 10 });
  pdf.addText(`Tel: ${companyConfig.phone} | Email: ${companyConfig.email}`, { size: 10 });
  pdf.addText('');
  
  // Título
  pdf.addText('REPORTE POR CLIENTE', { bold: true, size: 18 });
  pdf.addText('');
  pdf.addHorizontalLine();
  
  // Información del reporte
  const currentDate = new Date();
  pdf.addText(`Fecha de generación: ${currentDate.toLocaleString('es-ES')}`, { size: 12 });
  pdf.addText(`Período: ${new Date(filters.date_from).toLocaleDateString('es-ES')} - ${new Date(filters.date_to).toLocaleDateString('es-ES')}`, { size: 12 });
  pdf.addText('');
  
  // Información del cliente
  pdf.addText('INFORMACIÓN DEL CLIENTE', { bold: true, size: 14 });
  pdf.addText('');
  
  const clientInfoTable = [
    ['Cliente:', reportData.client_name],
    ['Total de Servicios:', reportData.total_services.toString()],
    ['Valor Total:', `$${reportData.total_amount.toLocaleString()}`],
    ['Valor Promedio:', `$${Math.round(reportData.total_amount / reportData.total_services).toLocaleString()}`]
  ];
  
  pdf.addTable(['Campo', 'Valor'], clientInfoTable);
  pdf.addText('');
  
  // Detalle de servicios
  pdf.addText('DETALLE DE SERVICIOS', { bold: true, size: 14 });
  pdf.addText('');
  
  const serviceHeaders = ['Folio', 'Fecha', 'Tipo', 'Grúa', 'Operador', 'Estado', 'Monto'];
  const serviceRows = reportData.services.map(service => [
    service.folio,
    new Date(service.service_date).toLocaleDateString('es-ES'),
    service.service_type,
    `${service.crane_brand} ${service.crane_model}`,
    service.operator_name,
    service.status === 'completed' ? 'Completado' : 
    service.status === 'in_progress' ? 'En Progreso' : 
    service.status === 'pending' ? 'Pendiente' : 'Cancelado',
    `$${service.amount.toLocaleString()}`
  ]);
  
  pdf.addTable(serviceHeaders, serviceRows);
  
  // Footer
  pdf.addText('');
  pdf.addText(`${companyConfig.name} - ${companyConfig.address}`, { size: 8 });
  pdf.addText(`Tel: ${companyConfig.phone} | Email: ${companyConfig.email}`, { size: 8 });
  
  return pdf.getBlob();
}
