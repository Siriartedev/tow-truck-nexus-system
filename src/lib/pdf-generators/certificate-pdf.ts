
import { PDFGenerator } from '../pdf-utils';
import type { Service } from '@/types/services';
import type { ServiceInspection } from '@/types/operator-portal';

export function generateCertificatePDF(service: Service, inspection: ServiceInspection): Blob {
  const pdf = new PDFGenerator();
  
  // Header with company logo and info
  pdf.addHeader(
    'GRÚAS 5 NORTE',
    'CERTIFICADO DE INSPECCIÓN PRE-SERVICIO'
  );

  // Company details
  pdf.addText('RUT: 76.769.841-0', { size: 10 });
  pdf.addText('Panamericana Norte Km. 841, Copiapó - Región de Atacama', { size: 10 });
  pdf.addText('Teléfono: +56 9 62380627 | Email: asistencia@gruas5norte.cl', { size: 10 });
  pdf.addText('', { size: 8 });

  // Document header with folio and date
  const currentDate = new Date();
  const documentHeader = [
    ['FOLIO:', service.folio, '', 'FECHA EMISIÓN:', currentDate.toLocaleDateString('es-ES')],
    ['HORA EMISIÓN:', currentDate.toLocaleTimeString('es-ES', { hour12: false }), '', 'PÁGINA:', '1 de 1']
  ];
  pdf.addTable(['', '', '', '', ''], documentHeader);
  pdf.addText('');

  // Service information section
  pdf.addText('INFORMACIÓN DEL SERVICIO', { bold: true, size: 12 });
  const serviceInfo = [
    ['Fecha de Servicio:', new Date(service.service_date).toLocaleDateString('es-ES'), 'Hora:', new Date(service.service_date).toLocaleTimeString('es-ES', { hour12: false })],
    ['Tipo de Servicio:', service.service_type_name, 'Folio Interno:', service.folio],
    ['Origen/Retiro:', service.pickup_location, '', ''],
    ['Destino/Entrega:', service.delivery_location, '', '']
  ];
  pdf.addTable(['Campo', 'Valor', 'Campo', 'Valor'], serviceInfo);
  pdf.addText('');

  // Vehicle information
  pdf.addText('INFORMACIÓN DEL VEHÍCULO', { bold: true, size: 12 });
  const vehicleInfo = [
    ['Marca:', service.vehicle_brand || 'N/A', 'Modelo:', service.vehicle_model || 'N/A'],
    ['Patente:', service.license_plate || 'N/A', 'Color:', 'No especificado'],
    ['Año:', 'No especificado', 'Combustible:', 'No especificado'],
    ['N° Motor:', 'No especificado', 'N° Chasis:', 'No especificado']
  ];
  pdf.addTable(['Campo', 'Valor', 'Campo', 'Valor'], vehicleInfo);
  pdf.addText('');

  // Client and operator information
  pdf.addText('INFORMACIÓN DE PARTICIPANTES', { bold: true, size: 12 });
  const participantsInfo = [
    ['Cliente/Empresa:', service.client_name, 'RUT Cliente:', 'No especificado'],
    ['Persona Presente:', inspection.client_present_name || 'No especificado', 'Teléfono:', 'No especificado'],
    ['Operador Grúa:', service.operator_name, 'Grúa Asignada:', service.crane_name],
    ['RUT Operador:', 'No especificado', 'Patente Grúa:', 'No especificado']
  ];
  pdf.addTable(['Campo', 'Valor', 'Campo', 'Valor'], participantsInfo);
  pdf.addText('');

  // Vehicle inventory checklist
  pdf.addText('INVENTARIO DE ELEMENTOS DEL VEHÍCULO', { bold: true, size: 12 });
  pdf.addText('Marque con X los elementos presentes en el vehículo:', { size: 10 });
  pdf.addText('');

  // Create inventory checklist with 4 columns
  const inventoryHeaders = ['Elemento', 'Estado', 'Elemento', 'Estado'];
  const inventoryRows: string[][] = [];
  
  // Group items in pairs for the table
  for (let i = 0; i < inspection.inspection_items.length; i += 2) {
    const row: string[] = [];
    for (let j = 0; j < 2; j++) {
      const item = inspection.inspection_items[i + j];
      if (item) {
        row.push(`☐ ${item.name}`);
        row.push(item.checked ? '[X]' : '[ ]');
      } else {
        row.push('');
        row.push('');
      }
    }
    inventoryRows.push(row);
  }

  pdf.addTable(inventoryHeaders, inventoryRows);
  
  // Inventory summary
  const checkedItems = inspection.inspection_items.filter(item => item.checked);
  pdf.addText('');
  pdf.addText(`RESUMEN: ${checkedItems.length} elementos verificados de ${inspection.inspection_items.length} elementos inspeccionados`, { size: 10, bold: true });
  pdf.addText(`Porcentaje de completitud: ${Math.round((checkedItems.length / inspection.inspection_items.length) * 100)}%`, { size: 10 });
  pdf.addText('');

  // Observations section
  pdf.addText('OBSERVACIONES DEL ESTADO DEL VEHÍCULO', { bold: true, size: 12 });
  pdf.addText('Detalle cualquier daño, condición especial o característica relevante del vehículo:', { size: 10 });
  
  // Create observation box
  const observationText = inspection.observations || 'Sin observaciones registradas.';
  pdf.addText('');
  pdf.addText('┌─────────────────────────────────────────────────────────────────────────────────────┐', { size: 8 });
  pdf.addText(`│ ${observationText.padEnd(85)}│`, { size: 9 });
  pdf.addText('│                                                                                     │', { size: 8 });
  pdf.addText('│                                                                                     │', { size: 8 });
  pdf.addText('│                                                                                     │', { size: 8 });
  pdf.addText('└─────────────────────────────────────────────────────────────────────────────────────┘', { size: 8 });
  pdf.addText('');

  // Photo documentation section
  pdf.addText('DOCUMENTACIÓN FOTOGRÁFICA', { bold: true, size: 12 });
  const photosWithFiles = inspection.photos.filter(p => p.file);
  if (photosWithFiles.length > 0) {
    pdf.addText(`Se capturaron ${photosWithFiles.length} fotografías del vehículo como respaldo visual.`, { size: 10 });
    
    // List photo types
    photosWithFiles.forEach((photo, index) => {
      const photoType = photo.type.charAt(0).toUpperCase() + photo.type.slice(1);
      const timestamp = new Date(photo.timestamp);
      pdf.addText(`${index + 1}. ${photoType} - ${timestamp.toLocaleDateString('es-ES')} ${timestamp.toLocaleTimeString('es-ES')}`, { size: 9, indent: 5 });
    });
  } else {
    pdf.addText('No se capturaron fotografías durante la inspección.', { size: 10 });
  }
  pdf.addText('');

  // Digital signatures section
  pdf.addText('FIRMAS Y VALIDACIÓN', { bold: true, size: 12 });
  pdf.addText('Las siguientes firmas validan la conformidad del estado documentado del vehículo:', { size: 10 });
  pdf.addText('');
  
  // Operator signature
  pdf.addText('FIRMA DEL OPERADOR:', { bold: true, size: 11 });
  pdf.addText('Certifico que he realizado la inspección completa del vehículo y que la información');
  pdf.addText('registrada corresponde al estado real encontrado.');
  pdf.addText('');
  pdf.addText('');
  pdf.addText('_________________________________                    Fecha: ________________');
  pdf.addText(`${service.operator_name}`, { size: 10 });
  pdf.addText('Operador de Grúa', { size: 9 });
  pdf.addText('');
  
  // Client signature
  pdf.addText('FIRMA DEL CLIENTE:', { bold: true, size: 11 });
  pdf.addText('Acepto que el estado del vehículo ha sido documentado correctamente y autorizo');
  pdf.addText('el traslado del mismo bajo las condiciones registradas.');
  pdf.addText('');
  pdf.addText('');
  pdf.addText('_________________________________                    Fecha: ________________');
  pdf.addText(`${inspection.client_present_name || 'Cliente/Representante'}`, { size: 10 });
  pdf.addText('Cliente o Representante', { size: 9 });
  pdf.addText('');

  // Legal disclaimer
  pdf.addText('DECLARACIÓN LEGAL', { bold: true, size: 11 });
  pdf.addText('Este certificado constituye evidencia del estado del vehículo al momento del retiro.', { size: 9 });
  pdf.addText('Cualquier daño no registrado que sea detectado posteriormente no será responsabilidad', { size: 9 });
  pdf.addText('de Grúas 5 Norte. Este documento tiene validez legal para efectos de reclamos.', { size: 9 });
  pdf.addText('');

  // Footer
  pdf.addText('────────────────────────────────────────────────────────────────────────────────────', { size: 8 });
  pdf.addText('GRÚAS 5 NORTE - Panamericana Norte Km. 841, Copiapó - Tel: +56 9 62380627', { size: 8 });
  pdf.addText(`Documento generado automáticamente el ${currentDate.toLocaleDateString('es-ES')} a las ${currentDate.toLocaleTimeString('es-ES')}`, { size: 8 });

  return pdf.getBlob();
}
