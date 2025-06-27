
import { PDFGenerator } from '../pdf-utils';
import type { Service } from '@/types/services';
import type { ServiceInspection } from '@/types/operator-portal';

export function generateServiceReportPDF(service: Service, inspection?: ServiceInspection): Blob {
  const pdf = new PDFGenerator();
  
  pdf.addHeader(
    'REPORTE DE SERVICIO',
    `Folio: ${service.folio}`
  );

  // Service information
  pdf.addText('INFORMACIÓN DEL SERVICIO', { bold: true, size: 12 });
  pdf.addText(`Cliente: ${service.client_name}`, { indent: 5 });
  pdf.addText(`Tipo de servicio: ${service.service_type_name}`, { indent: 5 });
  pdf.addText(`Operador: ${service.operator_name}`, { indent: 5 });
  pdf.addText(`Grúa: ${service.crane_name}`, { indent: 5 });
  pdf.addText(`Fecha: ${new Date(service.service_date).toLocaleDateString('es-ES')}`, { indent: 5 });
  pdf.addText('');

  // Vehicle information
  if (service.vehicle_brand || service.vehicle_model || service.license_plate) {
    pdf.addText('INFORMACIÓN DEL VEHÍCULO', { bold: true, size: 12 });
    if (service.vehicle_brand) pdf.addText(`Marca: ${service.vehicle_brand}`, { indent: 5 });
    if (service.vehicle_model) pdf.addText(`Modelo: ${service.vehicle_model}`, { indent: 5 });
    if (service.license_plate) pdf.addText(`Placas: ${service.license_plate}`, { indent: 5 });
    pdf.addText('');
  }

  // Locations
  pdf.addText('UBICACIONES', { bold: true, size: 12 });
  pdf.addText(`Origen: ${service.pickup_location}`, { indent: 5 });
  pdf.addText(`Destino: ${service.delivery_location}`, { indent: 5 });
  pdf.addText('');

  // Inspection details if available
  if (inspection) {
    pdf.addText('INSPECCIÓN REALIZADA', { bold: true, size: 12 });
    
    // Inspection items
    const checkedItems = inspection.inspection_items.filter(item => item.checked);
    const uncheckedItems = inspection.inspection_items.filter(item => !item.checked);
    
    if (checkedItems.length > 0) {
      pdf.addText('Elementos verificados:', { bold: true, indent: 5 });
      checkedItems.forEach(item => {
        pdf.addText(`• ${item.name}`, { indent: 10 });
      });
    }
    
    if (uncheckedItems.length > 0) {
      pdf.addText('Elementos no presentes/aplicables:', { bold: true, indent: 5 });
      uncheckedItems.forEach(item => {
        pdf.addText(`• ${item.name}`, { indent: 10 });
      });
    }

    // Client present
    if (inspection.client_present_name) {
      pdf.addText('');
      pdf.addText(`Cliente presente durante inspección: ${inspection.client_present_name}`, { indent: 5 });
    }

    // Observations
    if (inspection.observations) {
      pdf.addText('');
      pdf.addText('Observaciones de la inspección:', { bold: true, indent: 5 });
      pdf.addText(inspection.observations, { indent: 10 });
    }

    // Photos
    if (inspection.photos.length > 0) {
      pdf.addText('');
      pdf.addText(`Fotografías capturadas: ${inspection.photos.filter(p => p.file).length}`, { indent: 5 });
    }

    // Signatures
    pdf.addText('');
    pdf.addText('FIRMAS', { bold: true, size: 12 });
    pdf.addText(`Operador: ${inspection.signatures.operator ? 'Firmado' : 'Pendiente'}`, { indent: 5 });
    pdf.addText(`Cliente: ${inspection.signatures.client ? 'Firmado' : 'Pendiente'}`, { indent: 5 });
  }

  // Financial information
  pdf.addText('');
  pdf.addText('INFORMACIÓN FINANCIERA', { bold: true, size: 12 });
  pdf.addText(`Valor del servicio: $${service.service_value.toLocaleString()}`, { indent: 5 });
  pdf.addText(`Comisión operador: $${service.operator_commission.toLocaleString()}`, { indent: 5 });

  // Service observations
  if (service.observations) {
    pdf.addText('');
    pdf.addText('OBSERVACIONES DEL SERVICIO', { bold: true, size: 12 });
    pdf.addText(service.observations, { indent: 5 });
  }

  pdf.addFooter('Reporte generado automáticamente por Sistema de Grúas');

  return pdf.getBlob();
}
