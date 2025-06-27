
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
  
  // Header con información de la empresa desde configuración
  const companyName = companyConfig?.name || 'GRÚAS 5 NORTE';
  const companyRut = companyConfig?.rut || '76.769.841-0';
  const companyAddress = companyConfig?.address || 'Panamericana Norte Km. 841, Copiapó';
  const companyPhone = companyConfig?.phone || '+56 9 62380627';
  const companyEmail = companyConfig?.email || 'asistencia@gruas5norte.cl';
  
  // Logo si existe
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
  
  // Título principal centrado
  pdf.addText('REPORTE DE INSPECCIÓN PRE-SERVICIO', { bold: true, size: 18 });
  pdf.addText('');
  
  pdf.addHorizontalLine();
  
  // Información del documento
  const currentDate = new Date();
  pdf.addText(`Folio: ${service.folio}`, { size: 12 });
  pdf.addText(`Documento generado: ${currentDate.toLocaleDateString('es-ES')}, ${currentDate.toLocaleTimeString('es-ES')}`, { size: 12 });
  pdf.addText('');
  
  // INFORMACIÓN DEL SERVICIO
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
  
  // INVENTARIO DE EQUIPOS Y ACCESORIOS
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
  
  const checkedItems = inspection.inspection_items.filter(item => item.checked);
  const totalItems = inspection.inspection_items.length;
  const percentage = Math.round((checkedItems.length / totalItems) * 100);
  
  pdf.addText('');
  pdf.addText(`Elementos verificados: ${checkedItems.length} de ${totalItems}`, { bold: true, size: 12 });
  pdf.addText(`Porcentaje de completitud: ${percentage}%`, { bold: true, size: 12 });
  pdf.addText('');
  
  // SET FOTOGRÁFICO - Con fotografías reales
  pdf.addText('SET FOTOGRÁFICO', { bold: true, size: 14 });
  pdf.addText('');
  
  const photosWithFiles = inspection.photos.filter(p => p.file);
  
  if (photosWithFiles.length > 0) {
    // Procesar todas las imágenes de forma asíncrona
    const processedPhotos = await Promise.all(
      photosWithFiles.map(async (photo, index) => {
        try {
          const base64Data = await fileToBase64(photo.file!);
          const timestamp = new Date(photo.timestamp);
          const dateStr = timestamp.toLocaleDateString('es-ES');
          const timeStr = timestamp.toLocaleTimeString('es-ES', { hour12: false });
          
          return {
            index: index + 1,
            type: photo.type.charAt(0).toUpperCase() + photo.type.slice(1),
            dateStr,
            timeStr,
            base64Data
          };
        } catch (error) {
          console.error('Error processing photo:', error);
          return null;
        }
      })
    );
    
    // Agregar las fotos procesadas al PDF
    processedPhotos.forEach(photo => {
      if (photo) {
        pdf.addText(`${photo.index}. Foto ${photo.type} - ${photo.dateStr} ${photo.timeStr}`, { bold: true, size: 12 });
        pdf.addImage(photo.base64Data, 50, 30);
        pdf.addText('');
      }
    });
  } else {
    pdf.addText('No se capturaron fotografías durante la inspección.', { size: 12 });
    pdf.addText('');
  }
  
  pdf.addText(`Set fotográfico: ${photosWithFiles.length} fotografías procesadas`, { bold: true, size: 12 });
  pdf.addText('');
  
  // OBSERVACIONES DEL VEHÍCULO
  pdf.addText('OBSERVACIONES DEL VEHÍCULO', { bold: true, size: 14 });
  pdf.addText('');
  
  const observationText = inspection.observations || 'Sin observaciones registradas';
  pdf.addText(observationText, { size: 12 });
  pdf.addText('');
  
  // FIRMAS DIGITALES - Con firmas reales
  pdf.addText('FIRMAS DIGITALES', { bold: true, size: 14 });
  pdf.addText('');
  
  // Firma del Operador
  pdf.addText('Firma del Operador:', { bold: true, size: 12 });
  pdf.addText('');
  
  if (inspection.signatures.operator) {
    pdf.addSignature(inspection.signatures.operator, 60, 30);
  } else {
    pdf.addText('[SIN FIRMA CAPTURADA]', { size: 10 });
  }
  
  pdf.addText('_'.repeat(50), { size: 8 });
  pdf.addText(service.operator_name, { size: 12 });
  pdf.addText('Operador de Grúa', { size: 10 });
  pdf.addText('');
  
  // Firma del Cliente
  pdf.addText('Firma del Cliente:', { bold: true, size: 12 });
  pdf.addText('');
  
  if (inspection.signatures.client) {
    pdf.addSignature(inspection.signatures.client, 60, 30);
  } else {
    pdf.addText('[SIN FIRMA CAPTURADA]', { size: 10 });
  }
  
  pdf.addText('_'.repeat(50), { size: 8 });
  pdf.addText(inspection.client_present_name || service.client_name, { size: 12 });
  pdf.addText('Cliente', { size: 10 });
  pdf.addText('');
  
  // Footer con información de la empresa
  pdf.addText(`${companyName} - ${companyAddress}`, { size: 10 });
  pdf.addText(`Tel: ${companyPhone} | Email: ${companyEmail}`, { size: 10 });

  return pdf.getBlob();
}
