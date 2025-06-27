
import { PDFGenerator } from '../pdf-utils';
import type { Service } from '@/types/services';
import type { ServiceInspection } from '@/types/operator-portal';

export function generateCertificatePDF(service: Service, inspection: ServiceInspection): Blob {
  const pdf = new PDFGenerator();
  
  pdf.addHeader(
    'CERTIFICADO DE INSPECCIÓN',
    `Servicio: ${service.folio}`
  );

  // Certificate body
  pdf.addText('');
  pdf.addText('CERTIFICACIÓN', { bold: true, size: 14 });
  pdf.addText('Por medio del presente documento se certifica que:', { size: 12 });
  pdf.addText('');

  const certificationText = `El vehículo ${service.vehicle_brand || ''} ${service.vehicle_model || ''} con placas ${service.license_plate || 'N/A'} ha sido inspeccionado y trasladado según los estándares de calidad establecidos por nuestra empresa.`;
  
  pdf.addText(certificationText, { size: 11 });
  pdf.addText('');

  // Service details
  pdf.addTable(
    ['Concepto', 'Detalle'],
    [
      ['Cliente', service.client_name],
      ['Fecha de servicio', new Date(service.service_date).toLocaleDateString('es-ES')],
      ['Operador responsable', service.operator_name],
      ['Grúa utilizada', service.crane_name],
      ['Origen', service.pickup_location],
      ['Destino', service.delivery_location]
    ]
  );

  // Inspection summary
  pdf.addText('');
  pdf.addText('RESUMEN DE INSPECCIÓN', { bold: true, size: 12 });
  const checkedItems = inspection.inspection_items.filter(item => item.checked);
  pdf.addText(`Elementos verificados: ${checkedItems.length} de ${inspection.inspection_items.length}`, { indent: 5 });
  
  if (inspection.client_present_name) {
    pdf.addText(`Cliente presente: ${inspection.client_present_name}`, { indent: 5 });
  }

  pdf.addText(`Fotografías documentales: ${inspection.photos.filter(p => p.file).length}`, { indent: 5 });
  pdf.addText('');

  // Certification statement
  pdf.addText('Este certificado avala que el servicio fue ejecutado conforme a nuestros protocolos de calidad y seguridad.', { size: 11 });
  pdf.addText('');
  pdf.addText('');

  // Signatures section
  pdf.addText('FIRMAS DIGITALES', { bold: true, size: 12 });
  pdf.addText('');
  pdf.addText('_____________________                    _____________________', { size: 10 });
  pdf.addText('Operador Certificado                         Cliente', { size: 10 });
  pdf.addText(`${service.operator_name}                    ${inspection.client_present_name || 'N/A'}`, { size: 9 });

  pdf.addFooter('Certificado emitido por Sistema de Grúas - Documento con validez oficial');

  return pdf.getBlob();
}
