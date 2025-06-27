
import { PDFGenerator } from '../pdf-utils';
import type { CraneReportData } from '@/types/reports';
import type { CompanyConfig } from '@/types/configuration';

export function generateCranesReportPDF(
  cranes: CraneReportData[],
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
  
  pdf.addText('REPORTE DE GRÚAS', { bold: true, size: 18 });
  pdf.addText('');
  pdf.addHorizontalLine();
  
  // Información del reporte
  const currentDate = new Date();
  pdf.addText(`Fecha de generación: ${currentDate.toLocaleString('es-ES')}`, { size: 12 });
  pdf.addText('');
  
  // Estadísticas generales
  const totalServices = cranes.reduce((sum, crane) => sum + crane.services_count, 0);
  const totalRevenue = cranes.reduce((sum, crane) => sum + crane.total_revenue, 0);
  const avgUtilization = cranes.reduce((sum, crane) => sum + crane.utilization_percentage, 0) / cranes.length;
  
  pdf.addText('RESUMEN DE FLOTA', { bold: true, size: 14 });
  pdf.addText('');
  
  const fleetSummaryTable = [
    ['Total de Grúas:', cranes.length.toString()],
    ['Servicios Totales:', totalServices.toString()],
    ['Ingresos Totales:', `$${totalRevenue.toLocaleString()}`],
    ['Utilización Promedio:', `${avgUtilization.toFixed(1)}%`],
    ['Servicios por Grúa:', `${Math.round(totalServices / cranes.length)}`],
    ['Ingresos por Grúa:', `$${Math.round(totalRevenue / cranes.length).toLocaleString()}`],
    ['Ingreso por Servicio:', `$${Math.round(totalRevenue / totalServices).toLocaleString()}`]
  ];
  
  pdf.addTable(['Métrica', 'Valor'], fleetSummaryTable);
  pdf.addText('');
  
  // Detalle por grúa
  pdf.addText('DETALLE POR GRÚA', { bold: true, size: 14 });
  pdf.addText('');
  
  const craneHeaders = ['Identificador', 'Marca/Modelo', 'Servicios', 'Utilización', 'Ingresos', 'Estado'];
  const craneRows = cranes.map(crane => [
    crane.crane_identifier,
    `${crane.brand} ${crane.model}`,
    crane.services_count.toString(),
    `${crane.utilization_percentage}%`,
    `$${crane.total_revenue.toLocaleString()}`,
    'Activa'
  ]);
  
  pdf.addTable(craneHeaders, craneRows);
  pdf.addText('');
  
  // Análisis de eficiencia
  pdf.addText('ANÁLISIS DE EFICIENCIA', { bold: true, size: 14 });
  pdf.addText('');
  
  const sortedByUtilization = [...cranes].sort((a, b) => b.utilization_percentage - a.utilization_percentage);
  const sortedByRevenue = [...cranes].sort((a, b) => b.total_revenue - a.total_revenue);
  const sortedByServices = [...cranes].sort((a, b) => b.services_count - a.services_count);
  
  pdf.addText('Grúas con Mayor Utilización:', { bold: true, size: 12 });
  sortedByUtilization.slice(0, 3).forEach((crane, index) => {
    pdf.addText(`${index + 1}. ${crane.crane_identifier} - ${crane.utilization_percentage}%`, { size: 11, indent: 5 });
  });
  pdf.addText('');
  
  pdf.addText('Grúas con Mayores Ingresos:', { bold: true, size: 12 });
  sortedByRevenue.slice(0, 3).forEach((crane, index) => {
    pdf.addText(`${index + 1}. ${crane.crane_identifier} - $${crane.total_revenue.toLocaleString()}`, { size: 11, indent: 5 });
  });
  pdf.addText('');
  
  pdf.addText('Grúas con Más Servicios:', { bold: true, size: 12 });
  sortedByServices.slice(0, 3).forEach((crane, index) => {
    pdf.addText(`${index + 1}. ${crane.crane_identifier} - ${crane.services_count} servicios`, { size: 11, indent: 5 });
  });
  pdf.addText('');
  
  // Recomendaciones
  pdf.addText('RECOMENDACIONES', { bold: true, size: 14 });
  pdf.addText('');
  
  const lowUtilization = cranes.filter(c => c.utilization_percentage < 50);
  const highUtilization = cranes.filter(c => c.utilization_percentage > 90);
  
  if (lowUtilization.length > 0) {
    pdf.addText(`• ${lowUtilization.length} grúa(s) con baja utilización (<50%): Considerar redistribución de carga de trabajo.`, { size: 11 });
  }
  
  if (highUtilization.length > 0) {
    pdf.addText(`• ${highUtilization.length} grúa(s) con alta utilización (>90%): Monitorear mantenimiento preventivo.`, { size: 11 });
  }
  
  pdf.addText(`• La utilización promedio de la flota es ${avgUtilization.toFixed(1)}%, ${avgUtilization > 75 ? 'excelente' : avgUtilization > 60 ? 'buena' : 'mejorable'} gestión.`, { size: 11 });
  
  // Footer
  pdf.addText('');
  pdf.addText(`${companyConfig.name} - ${companyConfig.address}`, { size: 8 });
  pdf.addText(`Tel: ${companyConfig.phone} | Email: ${companyConfig.email}`, { size: 8 });
  
  return pdf.getBlob();
}
