
import { PDFGenerator } from '../pdf-utils';
import type { ServiceReportItem } from '@/types/reports';
import type { CompanyConfig } from '@/types/configuration';

export function generateServicesReportPDF(
  services: ServiceReportItem[],
  filters: { date_from: string; date_to: string },
  companyConfig: CompanyConfig
): Blob {
  const pdf = new PDFGenerator();
  
  // Header
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
  
  pdf.addText('REPORTE DE SERVICIOS', { bold: true, size: 18 });
  pdf.addText('');
  pdf.addHorizontalLine();
  
  // Información del reporte
  const currentDate = new Date();
  pdf.addText(`Fecha de generación: ${currentDate.toLocaleString('es-ES')}`, { size: 12 });
  pdf.addText(`Período: ${new Date(filters.date_from).toLocaleDateString('es-ES')} - ${new Date(filters.date_to).toLocaleDateString('es-ES')}`, { size: 12 });
  pdf.addText('');
  
  // Estadísticas generales
  const completed = services.filter(s => s.status === 'completed').length;
  const inProgress = services.filter(s => s.status === 'in_progress').length;
  const pending = services.filter(s => s.status === 'pending').length;
  const cancelled = services.filter(s => s.status === 'cancelled').length;
  const totalAmount = services.reduce((sum, s) => sum + s.amount, 0);
  
  pdf.addText('RESUMEN ESTADÍSTICO', { bold: true, size: 14 });
  pdf.addText('');
  
  const statsTable = [
    ['Total de Servicios:', services.length.toString()],
    ['Completados:', `${completed} (${Math.round((completed / services.length) * 100)}%)`],
    ['En Progreso:', `${inProgress} (${Math.round((inProgress / services.length) * 100)}%)`],
    ['Pendientes:', `${pending} (${Math.round((pending / services.length) * 100)}%)`],
    ['Cancelados:', `${cancelled} (${Math.round((cancelled / services.length) * 100)}%)`],
    ['Valor Total:', `$${totalAmount.toLocaleString()}`],
    ['Valor Promedio:', `$${Math.round(totalAmount / services.length).toLocaleString()}`]
  ];
  
  pdf.addTable(['Métrica', 'Valor'], statsTable);
  pdf.addText('');
  
  // Detalle de servicios
  pdf.addText('DETALLE DE SERVICIOS', { bold: true, size: 14 });
  pdf.addText('');
  
  const serviceHeaders = ['Folio', 'Fecha', 'Tipo', 'Vehículo', 'Operador', 'Estado', 'Monto'];
  const serviceRows = services.map(service => [
    service.folio,
    new Date(service.service_date).toLocaleDateString('es-ES'),
    service.service_type,
    `${service.vehicle_brand} ${service.vehicle_model} - ${service.license_plate}`,
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
