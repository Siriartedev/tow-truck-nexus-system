
import { PDFGenerator } from '../pdf-utils';
import type { ClientReportData } from '@/types/reports';
import type { CompanyConfig } from '@/types/configuration';

export function generateClientReportPDF(
  reportData: ClientReportData,
  filters: { date_from: string; date_to: string },
  companyConfig: CompanyConfig
): Blob {
  // Crear PDF con orientación horizontal para mejor visualización de columnas
  const pdf = new PDFGenerator({ orientation: 'landscape' });
  
  // Header compacto con datos de empresa en una sola línea
  pdf.addText(companyConfig.name, { bold: true, size: 14 });
  pdf.addText(`RUT: ${companyConfig.rut} | ${companyConfig.address} | Tel: ${companyConfig.phone}`, { size: 9 });
  pdf.addText('');
  
  // Título y información del reporte en formato compacto
  pdf.addText('REPORTE POR CLIENTE', { bold: true, size: 16 });
  const currentDate = new Date();
  pdf.addText(`Generado: ${currentDate.toLocaleDateString('es-ES')} | Período: ${new Date(filters.date_from).toLocaleDateString('es-ES')} - ${new Date(filters.date_to).toLocaleDateString('es-ES')}`, { size: 10 });
  pdf.addText('');
  
  // Información del cliente en formato horizontal compacto
  pdf.addText(`Cliente: ${reportData.client_name} | Servicios: ${reportData.total_services} | Total: $${reportData.total_amount.toLocaleString()} | Promedio: $${Math.round(reportData.total_amount / reportData.total_services).toLocaleString()}`, { size: 11, bold: true });
  pdf.addText('');
  pdf.addHorizontalLine();
  
  // Detalle de servicios con tabla optimizada
  const serviceHeaders = ['Folio', 'Fecha', 'Tipo', 'Marca', 'Modelo', 'Patente', 'Origen', 'Destino', 'Valor', 'Estado'];
  const serviceRows = reportData.services.map(service => [
    service.folio,
    new Date(service.service_date).toLocaleDateString('es-ES'),
    service.service_type,
    service.vehicle_brand,
    service.vehicle_model,
    service.license_plate,
    service.origin,
    service.destination,
    `$${service.amount.toLocaleString()}`,
    service.status === 'completed' ? 'Completado' : 
    service.status === 'in_progress' ? 'En Progreso' : 
    service.status === 'pending' ? 'Pendiente' : 'Cancelado'
  ]);
  
  pdf.addTable(serviceHeaders, serviceRows);
  
  // Footer compacto
  pdf.addText('');
  pdf.addText(`${companyConfig.name} - ${companyConfig.phone} - ${companyConfig.email}`, { size: 8 });
  
  return pdf.getBlob();
}
