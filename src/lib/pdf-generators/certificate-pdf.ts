
import { PDFGenerator } from '../pdf-utils';
import type { Service } from '@/types/services';
import type { ServiceInspection } from '@/types/operator-portal';

export function generateCertificatePDF(service: Service, inspection: ServiceInspection): Blob {
  const pdf = new PDFGenerator();
  
  // Header exacto como en la imagen - Logo y título
  pdf.addText('GRÚAS 5 NORTE', { bold: true, size: 16 });
  pdf.addText('SERVICIO 24 HORAS', { size: 10 });
  pdf.addText('');
  
  // Título principal centrado
  pdf.addText('REPORTE DE INSPECCIÓN PRE-SERVICIO', { bold: true, size: 18 });
  pdf.addText('');
  
  pdf.addHorizontalLine();
  
  // Información del documento (folio y fecha de generación)
  const currentDate = new Date();
  pdf.addText(`Folio: ${service.folio}`, { size: 12 });
  pdf.addText(`Documento generado: ${currentDate.toLocaleDateString('es-ES')}, ${currentDate.toLocaleTimeString('es-ES')}`, { size: 12 });
  pdf.addText('');
  
  // INFORMACIÓN DEL SERVICIO - Tabla exacta como en la imagen
  pdf.addText('INFORMACIÓN DEL SERVICIO', { bold: true, size: 14 });
  pdf.addText('');
  
  const serviceInfoTable = [
    ['Folio:', service.folio],
    ['Cliente:', service.client_name],
    ['Fecha de Servicio:', new Date(service.service_date).toLocaleDateString('es-ES')],
    ['Origen:', service.pickup_location],
    ['Destino:', service.delivery_location],
    ['Vehículo:', `${service.vehicle_brand || ''} ${service.vehicle_model || ''} - ${service.license_plate || ''}`.trim()],
    ['Grúa:', service.crane_name],
    ['Operador:', service.operator_name]
  ];
  
  pdf.addTable(['Campo', 'Valor'], serviceInfoTable);
  pdf.addText('');
  pdf.addText('');
  
  // INVENTARIO DE EQUIPOS Y ACCESORIOS - Tabla de 6 columnas exacta
  pdf.addText('INVENTARIO DE EQUIPOS Y ACCESORIOS', { bold: true, size: 14 });
  pdf.addText('');
  
  // Headers de la tabla de inventario (6 columnas)
  const inventoryHeaders = ['Elemento', 'Estado', 'Elemento', 'Estado', 'Elemento', 'Estado'];
  const inventoryRows: string[][] = [];
  
  // Agrupar elementos en grupos de 3 para crear filas de 6 columnas
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
  pdf.addText(`Elementos verificados: ${checkedItems.length} de ${totalItems}`, { bold: true, size: 12 });
  pdf.addText(`Porcentaje de completitud: ${percentage}%`, { bold: true, size: 12 });
  pdf.addText('');
  pdf.addText('');
  
  // SET FOTOGRÁFICO - Con fotografías reales mostradas
  pdf.addText('SET FOTOGRÁFICO', { bold: true, size: 14 });
  pdf.addText('');
  
  const photosWithFiles = inspection.photos.filter(p => p.file);
  
  if (photosWithFiles.length > 0) {
    photosWithFiles.forEach((photo, index) => {
      const photoType = photo.type.charAt(0).toUpperCase() + photo.type.slice(1);
      const timestamp = new Date(photo.timestamp);
      const dateStr = timestamp.toLocaleDateString('es-ES');
      const timeStr = timestamp.toLocaleTimeString('es-ES', { hour12: false });
      
      pdf.addText(`${index + 1}. Foto ${photoType} - ${dateStr} ${timeStr}`, { bold: true, size: 12 });
      pdf.addText(`   Archivo: ${photo.file?.name || 'foto_' + photo.type + '.jpg'}`, { size: 10 });
      pdf.addText(`   Tamaño: ${photo.file ? Math.round(photo.file.size / 1024) + ' KB' : 'N/A'}`, { size: 10 });
      
      // Agregar la imagen real al PDF si existe
      if (photo.file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          const imgData = e.target?.result as string;
          if (imgData) {
            pdf.addImage(imgData, 50, 30);
          }
        };
        reader.readAsDataURL(photo.file);
      }
      
      pdf.addText('');
    });
  } else {
    pdf.addText('No se capturaron fotografías durante la inspección.', { size: 12 });
    pdf.addText('');
  }
  
  pdf.addText(`Set fotográfico: ${photosWithFiles.length} fotografías procesadas`, { bold: true, size: 12 });
  pdf.addText('');
  pdf.addText('');
  
  // OBSERVACIONES DEL VEHÍCULO - Solo texto capturado
  pdf.addText('OBSERVACIONES DEL VEHÍCULO', { bold: true, size: 14 });
  pdf.addText('');
  
  const observationText = inspection.observations || 'Sin observaciones registradas';
  // Limpiar cualquier símbolo extraño
  const cleanObservations = observationText.replace(/[%]+/g, '').trim();
  
  pdf.addText(cleanObservations, { size: 12 });
  pdf.addText('');
  pdf.addText('');
  
  // FIRMAS DIGITALES - Con firmas reales mostradas
  pdf.addText('FIRMAS DIGITALES', { bold: true, size: 14 });
  pdf.addText('');
  
  // Firma del Operador
  pdf.addText('Firma del Operador:', { bold: true, size: 12 });
  pdf.addText('');
  
  if (inspection.signatures.operator) {
    const operatorSignatureDate = new Date();
    pdf.addText(`Firma capturada digitalmente el ${operatorSignatureDate.toLocaleDateString('es-ES')} a las ${operatorSignatureDate.toLocaleTimeString('es-ES')}`, { size: 10, bold: true });
    
    // Agregar la firma real del operador
    pdf.addSignature(inspection.signatures.operator, 60, 30);
  } else {
    pdf.addText('[SIN FIRMA CAPTURADA]', { size: 10 });
  }
  
  pdf.addText('_'.repeat(50), { size: 8 });
  pdf.addText(service.operator_name, { size: 12 });
  pdf.addText('Operador de Grúa', { size: 10 });
  pdf.addText('');
  pdf.addText('');
  
  // Firma del Cliente
  pdf.addText('Firma del Cliente:', { bold: true, size: 12 });
  pdf.addText('');
  
  if (inspection.signatures.client) {
    const clientSignatureDate = new Date();
    pdf.addText(`Firma capturada digitalmente el ${clientSignatureDate.toLocaleDateString('es-ES')} a las ${clientSignatureDate.toLocaleTimeString('es-ES')}`, { size: 10, bold: true });
    
    // Agregar la firma real del cliente
    pdf.addSignature(inspection.signatures.client, 60, 30);
  } else {
    pdf.addText('[SIN FIRMA CAPTURADA]', { size: 10 });
  }
  
  pdf.addText('_'.repeat(50), { size: 8 });
  pdf.addText(inspection.client_present_name || service.client_name, { size: 12 });
  pdf.addText('Cliente', { size: 10 });
  pdf.addText('');
  pdf.addText('');
  pdf.addText('');
  
  // Footer exacto como en la imagen
  pdf.addText('Grúas 5 Norte - Panamericana Norte Km. 841, Copiapó', { size: 10 });
  pdf.addText('Tel: +56 9 62380627 | Email: asistencia@gruas5norte.cl', { size: 10 });

  return pdf.getBlob();
}
