
import { PDFGenerator } from '../pdf-utils';
import type { Service } from '@/types/services';
import type { ServiceInspection } from '@/types/operator-portal';
import type { CompanyConfig } from '@/types/configuration';

// Helper function to convert File to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export async function generateCertificatePDF(
  service: Service, 
  inspection: ServiceInspection,
  companyConfig?: CompanyConfig
): Promise<Blob> {
  const pdf = new PDFGenerator();
  
  // HEADER - Exacto como las imágenes
  const companyName = companyConfig?.name || 'GRÚAS 5 NORTE';
  const companyRut = companyConfig?.rut || '76.769.841-0';
  const companyAddress = companyConfig?.address || 'Panamericana Norte Km. 841, Copiapó';
  const companyPhone = companyConfig?.phone || '+56 9 62380627';
  const companyEmail = companyConfig?.email || 'asistencia@gruas5norte.cl';
  
  // Logo
  if (companyConfig?.logo_url) {
    try {
      pdf.addImage(companyConfig.logo_url, 40, 20);
    } catch (error) {
      console.log('Logo no disponible');
    }
  }
  
  pdf.addText(companyName, { bold: true, size: 16 });
  pdf.addText(`RUT: ${companyRut}`, { size: 10 });
  pdf.addText(companyAddress, { size: 10 });
  pdf.addText(`Tel: ${companyPhone} | Email: ${companyEmail}`, { size: 10 });
  pdf.addText('');
  
  // Título centrado
  pdf.addText('REPORTE DE INSPECCIÓN PRE-SERVICIO', { bold: true, size: 18 });
  pdf.addText('');
  
  pdf.addHorizontalLine();
  
  // Información del documento
  const currentDate = new Date();
  pdf.addText(`Folio: ${service.folio}`, { size: 12 });
  pdf.addText(`Documento generado: ${currentDate.toLocaleDateString('es-ES')}, ${currentDate.toLocaleTimeString('es-ES')}`, { size: 12 });
  pdf.addText('');
  
  // INFORMACIÓN DEL SERVICIO - Tabla simple
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
  
  // INVENTARIO - Exacto 6 columnas como en la imagen
  pdf.addText('INVENTARIO DE EQUIPOS Y ACCESORIOS', { bold: true, size: 14 });
  pdf.addText('');
  
  const inventoryHeaders = ['Elemento', 'Estado', 'Elemento', 'Estado', 'Elemento', 'Estado'];
  const inventoryRows: string[][] = [];
  
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
  
  // Resumen de elementos
  const checkedItems = inspection.inspection_items.filter(item => item.checked);
  const totalItems = inspection.inspection_items.length;
  const percentage = Math.round((checkedItems.length / totalItems) * 100);
  
  pdf.addText('');
  pdf.addText(`Elementos verificados: ${checkedItems.length} de ${totalItems}`, { bold: true, size: 12 });
  pdf.addText(`Porcentaje de completitud: ${percentage}%`, { bold: true, size: 12 });
  pdf.addText('');
  
  // SET FOTOGRÁFICO - Simple como en la imagen
  pdf.addText('SET FOTOGRÁFICO', { bold: true, size: 14 });
  pdf.addText('');
  
  const photosWithFiles = inspection.photos.filter(p => p.file);
  
  if (photosWithFiles.length > 0) {
    // Procesar fotos de forma síncrona
    for (let i = 0; i < photosWithFiles.length; i++) {
      const photo = photosWithFiles[i];
      try {
        const base64Data = await fileToBase64(photo.file!);
        const timestamp = new Date(photo.timestamp);
        const dateStr = timestamp.toLocaleDateString('es-ES');
        const timeStr = timestamp.toLocaleTimeString('es-ES', { hour12: false });
        
        // Solo nombre de vista y fecha/hora
        pdf.addText(`${photo.type.charAt(0).toUpperCase() + photo.type.slice(1)} - ${dateStr} ${timeStr}`, { bold: true, size: 12 });
        pdf.addImage(base64Data, 50, 30);
        pdf.addText('');
      } catch (error) {
        console.error('Error processing photo:', error);
      }
    }
  } else {
    pdf.addText('No se capturaron fotografías durante la inspección.', { size: 12 });
    pdf.addText('');
  }
  
  pdf.addText(`Set fotográfico: ${photosWithFiles.length} fotografías procesadas`, { bold: true, size: 12 });
  pdf.addText('');
  
  // OBSERVACIONES - Simple
  pdf.addText('OBSERVACIONES DEL VEHÍCULO', { bold: true, size: 14 });
  pdf.addText('');
  
  const observationText = inspection.observations || 'Sin observaciones registradas';
  pdf.addText(observationText, { size: 12 });
  pdf.addText('');
  
  // FIRMAS DIGITALES - Lado a lado
  pdf.addText('FIRMAS DIGITALES', { bold: true, size: 14 });
  pdf.addText('');
  
  pdf.addSideBySideSignatures(
    inspection.signatures.operator,
    inspection.signatures.client,
    service.operator_name,
    inspection.client_present_name || service.client_name
  );
  
  pdf.addText('');
  
  // Footer básico
  pdf.addText(`${companyName} - ${companyAddress}`, { size: 10 });
  pdf.addText(`Tel: ${companyPhone} | Email: ${companyEmail}`, { size: 10 });

  return pdf.getBlob();
}
