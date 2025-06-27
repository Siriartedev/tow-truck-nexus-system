
import { PDFGenerator } from '../pdf-utils';
import type { Service } from '@/types/services';
import type { ServiceInspection } from '@/types/operator-portal';

export function generateCertificatePDF(service: Service, inspection: ServiceInspection): Blob {
  const pdf = new PDFGenerator();
  
  // Header moderno con información de la empresa
  pdf.addText('GRÚAS 5 NORTE', { bold: true, size: 18 });
  pdf.addText('CERTIFICADO DE INSPECCIÓN PRE-SERVICIO', { bold: true, size: 14 });
  pdf.addText('');
  
  // Información de la empresa
  pdf.addText('RUT: 76.769.841-0', { size: 10 });
  pdf.addText('Panamericana Norte Km. 841, Copiapó - Región de Atacama', { size: 10 });
  pdf.addText('Teléfono: +56 9 62380627 | Email: asistencia@gruas5norte.cl', { size: 10 });
  pdf.addHorizontalLine();

  // Información del documento
  const currentDate = new Date();
  const documentInfo = [
    ['FOLIO:', service.folio, 'FECHA:', currentDate.toLocaleDateString('es-ES')],
    ['OPERADOR:', service.operator_name, 'HORA:', currentDate.toLocaleTimeString('es-ES', { hour12: false })]
  ];
  pdf.addTable(['', '', '', ''], documentInfo);
  pdf.addText('');

  // Información del servicio
  pdf.addText('INFORMACIÓN DEL SERVICIO', { bold: true, size: 12 });
  const serviceInfo = [
    ['Fecha de Servicio:', new Date(service.service_date).toLocaleDateString('es-ES')],
    ['Tipo de Servicio:', service.service_type_name],
    ['Origen:', service.pickup_location],
    ['Destino:', service.delivery_location]
  ];
  pdf.addTable(['Campo', 'Valor'], serviceInfo);
  pdf.addText('');

  // Información del vehículo
  pdf.addText('DATOS DEL VEHÍCULO', { bold: true, size: 12 });
  const vehicleInfo = [
    ['Marca:', service.vehicle_brand || 'No especificado', 'Modelo:', service.vehicle_model || 'No especificado'],
    ['Patente:', service.license_plate || 'No especificado', 'Color:', 'No especificado']
  ];
  pdf.addTable(['', '', '', ''], vehicleInfo);
  pdf.addText('');

  // Cliente presente
  pdf.addText('CLIENTE PRESENTE', { bold: true, size: 12 });
  pdf.addText(`Nombre: ${inspection.client_present_name || 'No especificado'}`, { size: 10 });
  pdf.addText(`Cliente/Empresa: ${service.client_name}`, { size: 10 });
  pdf.addText('');

  // INVENTARIO DE EQUIPOS Y ACCESORIOS
  pdf.addText('INVENTARIO DE EQUIPOS Y ACCESORIOS', { bold: true, size: 12 });
  pdf.addText('Marque SI para elementos presentes, NO para elementos ausentes:', { size: 10 });
  pdf.addText('');

  // Crear tabla de inventario con 6 columnas (3 pares elemento/estado)
  const inventoryHeaders = ['Elemento', 'Estado', 'Elemento', 'Estado', 'Elemento', 'Estado'];
  const inventoryRows: string[][] = [];
  
  // Agrupar elementos en grupos de 3 para la tabla
  for (let i = 0; i < inspection.inspection_items.length; i += 3) {
    const row: string[] = [];
    for (let j = 0; j < 3; j++) {
      const item = inspection.inspection_items[i + j];
      if (item) {
        row.push(item.name);
        row.push(item.checked ? 'SI' : 'NO');
      } else {
        row.push('');
        row.push('');
      }
    }
    inventoryRows.push(row);
  }

  pdf.addTable(inventoryHeaders, inventoryRows);
  
  // Resumen del inventario
  const checkedItems = inspection.inspection_items.filter(item => item.checked);
  const totalItems = inspection.inspection_items.length;
  const percentage = Math.round((checkedItems.length / totalItems) * 100);
  
  pdf.addText('');
  pdf.addText(`RESUMEN: ${checkedItems.length} elementos verificados de ${totalItems} elementos inspeccionados`, { bold: true, size: 10 });
  pdf.addText(`Porcentaje de completitud: ${percentage}%`, { size: 10 });
  pdf.addText('');

  // SET FOTOGRÁFICO
  pdf.addText('SET FOTOGRÁFICO', { bold: true, size: 12 });
  const photosWithFiles = inspection.photos.filter(p => p.file);
  const totalPhotos = inspection.photos.length;
  
  pdf.addText(`Set fotográfico: ${photosWithFiles.length} de ${totalPhotos} fotos procesadas`, { size: 10, bold: true });
  pdf.addText('');

  if (photosWithFiles.length > 0) {
    photosWithFiles.forEach((photo, index) => {
      const photoType = photo.type.charAt(0).toUpperCase() + photo.type.slice(1);
      const timestamp = new Date(photo.timestamp);
      const dateStr = timestamp.toLocaleDateString('es-ES');
      const timeStr = timestamp.toLocaleTimeString('es-ES', { hour12: false });
      
      pdf.addText(`${index + 1}. Foto ${photoType} - ${dateStr} ${timeStr}`, { size: 9 });
    });
  } else {
    pdf.addText('No se procesaron fotografías durante la inspección.', { size: 10 });
  }
  pdf.addText('');

  // OBSERVACIONES DEL VEHÍCULO
  pdf.addText('OBSERVACIONES DEL VEHÍCULO', { bold: true, size: 12 });
  pdf.addText('Detalle del estado del vehículo, daños o condiciones especiales:', { size: 10 });
  pdf.addText('');
  
  // Crear caja de observaciones
  const observationText = inspection.observations || 'Sin observaciones registradas.';
  pdf.addText('┌─────────────────────────────────────────────────────────────────────────────────────┐', { size: 8 });
  
  // Dividir observaciones en líneas que quepan en la caja
  const maxCharsPerLine = 83;
  const observationLines = observationText.match(new RegExp(`.{1,${maxCharsPerLine}}`, 'g')) || [''];
  
  observationLines.forEach(line => {
    pdf.addText(`│ ${line.padEnd(maxCharsPerLine)} │`, { size: 9 });
  });
  
  // Agregar líneas vacías si es necesario
  for (let i = observationLines.length; i < 3; i++) {
    pdf.addText(`│ ${' '.repeat(maxCharsPerLine)} │`, { size: 8 });
  }
  
  pdf.addText('└─────────────────────────────────────────────────────────────────────────────────────┘', { size: 8 });
  pdf.addText('');

  // FIRMAS DIGITALES
  pdf.addText('FIRMAS DIGITALES', { bold: true, size: 12 });
  pdf.addText('Las siguientes firmas validan la inspección realizada:', { size: 10 });
  pdf.addText('');
  
  // Firma del operador
  pdf.addText('FIRMA DEL OPERADOR:', { bold: true, size: 11 });
  if (inspection.signatures.operator) {
    pdf.addText('[FIRMA DIGITAL CAPTURADA]', { size: 10, bold: true });
  } else {
    pdf.addText('[SIN FIRMA]', { size: 10 });
  }
  pdf.addText(`Nombre: ${service.operator_name}`, { size: 10 });
  pdf.addText(`Fecha: ${currentDate.toLocaleDateString('es-ES')} ${currentDate.toLocaleTimeString('es-ES')}`, { size: 10 });
  pdf.addText('');
  
  // Firma del cliente
  pdf.addText('FIRMA DEL CLIENTE:', { bold: true, size: 11 });
  if (inspection.signatures.client) {
    pdf.addText('[FIRMA DIGITAL CAPTURADA]', { size: 10, bold: true });
  } else {
    pdf.addText('[SIN FIRMA]', { size: 10 });
  }
  pdf.addText(`Nombre: ${inspection.client_present_name || 'Cliente/Representante'}`, { size: 10 });
  pdf.addText(`Fecha: ${currentDate.toLocaleDateString('es-ES')} ${currentDate.toLocaleTimeString('es-ES')}`, { size: 10 });
  pdf.addText('');

  // Footer legal
  pdf.addText('DECLARACIÓN LEGAL', { bold: true, size: 11 });
  pdf.addText('Este certificado constituye evidencia del estado del vehículo al momento del retiro.', { size: 9 });
  pdf.addText('Cualquier daño no registrado que sea detectado posteriormente no será responsabilidad', { size: 9 });
  pdf.addText('de Grúas 5 Norte. Este documento tiene validez legal para efectos de reclamos.', { size: 9 });
  pdf.addText('');

  // Footer de contacto
  pdf.addText('────────────────────────────────────────────────────────────────────────────────────', { size: 8 });
  pdf.addText('GRÚAS 5 NORTE - Panamericana Norte Km. 841, Copiapó - Tel: +56 9 62380627', { size: 8 });
  pdf.addText(`Documento generado automáticamente el ${currentDate.toLocaleDateString('es-ES')} a las ${currentDate.toLocaleTimeString('es-ES')}`, { size: 8 });

  return pdf.getBlob();
}
