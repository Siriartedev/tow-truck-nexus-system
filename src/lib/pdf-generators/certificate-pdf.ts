
import { PDFGenerator } from '../pdf-utils';
import type { Service } from '@/types/services';
import type { ServiceInspection } from '@/types/operator-portal';

export function generateCertificatePDF(service: Service, inspection: ServiceInspection): Blob {
  const pdf = new PDFGenerator();
  
  // Header with company info
  pdf.addHeader(
    'REPORTE DE INSPECCIÓN PRE-SERVICIO',
    'Grúas 5 Norte'
  );

  // Company details
  pdf.addText('RUT: 76.769.841-0', { size: 10 });
  pdf.addText('Panamericana Norte Km. 841, Copiapó', { size: 10 });
  pdf.addText('Tel: +56 9 62380627 | Email: asistencia@gruas5norte.cl', { size: 10 });
  pdf.addText('');

  // Document info line
  const currentDate = new Date();
  const documentInfo = `Folio: ${service.folio}                                                    Documento generado: ${currentDate.toLocaleDateString('es-ES')}, ${currentDate.toLocaleTimeString('es-ES')}`;
  pdf.addText(documentInfo, { size: 9 });
  pdf.addText('');

  // Service information section
  pdf.addText('INFORMACIÓN DEL SERVICIO', { bold: true, size: 12 });
  pdf.addText('');

  // Service details table
  const serviceData = [
    ['Folio:', service.folio],
    ['Cliente:', service.client_name],
    ['Fecha de Servicio:', new Date(service.service_date).toLocaleDateString('es-ES')],
    ['Origen:', service.pickup_location],
    ['Destino:', service.delivery_location],
    ['Vehículo:', `${service.vehicle_brand || ''} ${service.vehicle_model || ''} - ${service.license_plate || 'N/A'}`],
    ['Grúa:', service.crane_name],
    ['Operador:', service.operator_name]
  ];

  pdf.addTable(['Campo', 'Valor'], serviceData);
  pdf.addText('');

  // Inventory section
  pdf.addText('INVENTARIO DE EQUIPOS Y ACCESORIOS', { bold: true, size: 12 });
  pdf.addText('');

  // Create inventory table with 3 columns
  const inventoryHeaders = ['Elemento', 'Estado', 'Elemento', 'Estado', 'Elemento', 'Estado'];
  const inventoryRows: string[][] = [];
  
  // Group items in sets of 3 for the table
  for (let i = 0; i < inspection.inspection_items.length; i += 3) {
    const row: string[] = [];
    for (let j = 0; j < 3; j++) {
      const item = inspection.inspection_items[i + j];
      if (item) {
        row.push(item.name);
        row.push(item.checked ? 'SÍ' : 'NO');
      } else {
        row.push('');
        row.push('');
      }
    }
    inventoryRows.push(row);
  }

  pdf.addTable(inventoryHeaders, inventoryRows);
  
  // Summary stats
  const checkedItems = inspection.inspection_items.filter(item => item.checked);
  pdf.addText('');
  pdf.addText(`Elementos verificados: ${checkedItems.length} de ${inspection.inspection_items.length}`, { indent: 5 });
  pdf.addText(`Porcentaje de completitud: ${Math.round((checkedItems.length / inspection.inspection_items.length) * 100)}%`, { indent: 5 });
  pdf.addText('');

  // Photo section
  pdf.addText('SET FOTOGRÁFICO', { bold: true, size: 12 });
  pdf.addText('');
  
  const photosWithFiles = inspection.photos.filter(p => p.file);
  if (photosWithFiles.length > 0) {
    photosWithFiles.forEach((photo, index) => {
      const photoType = photo.type.charAt(0).toUpperCase() + photo.type.slice(1);
      pdf.addText(`${photoType}`, { indent: 5 });
      pdf.addText(`${new Date(photo.timestamp).toLocaleDateString('es-ES')}, ${new Date(photo.timestamp).toLocaleTimeString('es-ES')}`, { size: 8, indent: 5 });
      pdf.addText('');
    });
    pdf.addText(`Set fotográfico: 1 de ${photosWithFiles.length} fotos procesadas`, { size: 10 });
  } else {
    pdf.addText('Sin fotografías disponibles', { indent: 5 });
  }
  pdf.addText('');

  // Digital signatures section
  pdf.addText('FIRMAS DIGITALES', { bold: true, size: 12 });
  pdf.addText('');
  
  pdf.addText('Firma del Operador:');
  pdf.addText('');
  pdf.addText('');
  pdf.addText('_________________________________');
  pdf.addText(service.operator_name, { size: 10 });
  pdf.addText('');
  
  pdf.addText('Firma del Cliente:');
  pdf.addText('');
  pdf.addText('');
  pdf.addText('_________________________________');
  pdf.addText(inspection.client_present_name || 'N/A', { size: 10 });
  pdf.addText('');

  // Vehicle observations
  if (inspection.observations) {
    pdf.addText('OBSERVACIONES DEL VEHÍCULO', { bold: true, size: 12 });
    pdf.addText('');
    pdf.addText(inspection.observations, { indent: 5 });
    pdf.addText('');
  }

  // Footer
  pdf.addText('');
  pdf.addText('Grúas 5 Norte - Panamericana Norte Km. 841, Copiapó');
  pdf.addText('Tel: +56 9 62380627 | Email: asistencia@gruas5norte.cl');

  return pdf.getBlob();
}
