
import { PDFGenerator } from '../pdf-utils';
import type { OperatorReportData } from '@/types/reports';
import type { CompanyConfig } from '@/types/configuration';

export function generateOperatorsReportPDF(
  operators: OperatorReportData[],
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
  
  pdf.addText('REPORTE DE OPERADORES', { bold: true, size: 18 });
  pdf.addText('');
  pdf.addHorizontalLine();
  
  // Información del reporte
  const currentDate = new Date();
  pdf.addText(`Fecha de generación: ${currentDate.toLocaleString('es-ES')}`, { size: 12 });
  pdf.addText('');
  
  // Estadísticas generales
  const totalServices = operators.reduce((sum, op) => sum + op.services_count, 0);
  const totalCommissions = operators.reduce((sum, op) => sum + op.total_commissions, 0);
  const totalRevenue = operators.reduce((sum, op) => sum + op.total_revenue, 0);
  const avgRating = operators.reduce((sum, op) => sum + op.performance_rating, 0) / operators.length;
  
  pdf.addText('RESUMEN GENERAL', { bold: true, size: 14 });
  pdf.addText('');
  
  const summaryTable = [
    ['Total Operadores:', operators.length.toString()],
    ['Servicios Totales:', totalServices.toString()],
    ['Comisiones Totales:', `$${totalCommissions.toLocaleString()}`],
    ['Ingresos Generados:', `$${totalRevenue.toLocaleString()}`],
    ['Calificación Promedio:', `${avgRating.toFixed(1)}/5.0`],
    ['Servicios por Operador:', `${Math.round(totalServices / operators.length)}`],
    ['Comisión Promedio:', `$${Math.round(totalCommissions / operators.length).toLocaleString()}`]
  ];
  
  pdf.addTable(['Métrica', 'Valor'], summaryTable);
  pdf.addText('');
  
  // Detalle por operador
  pdf.addText('DETALLE POR OPERADOR', { bold: true, size: 14 });
  pdf.addText('');
  
  const operatorHeaders = ['Operador', 'Servicios', 'Comisiones', 'Ingresos', 'Calificación', 'Eficiencia'];
  const operatorRows = operators.map(operator => [
    operator.operator_name,
    operator.services_count.toString(),
    `$${operator.total_commissions.toLocaleString()}`,
    `$${operator.total_revenue.toLocaleString()}`,
    `${operator.performance_rating.toFixed(1)}/5.0`,
    `${Math.round((operator.services_count / totalServices) * 100)}%`
  ]);
  
  pdf.addTable(operatorHeaders, operatorRows);
  pdf.addText('');
  
  // Ranking de operadores
  pdf.addText('RANKING DE OPERADORES', { bold: true, size: 14 });
  pdf.addText('');
  
  const sortedByRevenue = [...operators].sort((a, b) => b.total_revenue - a.total_revenue);
  const sortedByRating = [...operators].sort((a, b) => b.performance_rating - a.performance_rating);
  const sortedByServices = [...operators].sort((a, b) => b.services_count - a.services_count);
  
  pdf.addText('Top por Ingresos Generados:', { bold: true, size: 12 });
  sortedByRevenue.slice(0, 3).forEach((op, index) => {
    pdf.addText(`${index + 1}. ${op.operator_name} - $${op.total_revenue.toLocaleString()}`, { size: 11, indent: 5 });
  });
  pdf.addText('');
  
  pdf.addText('Top por Calificación:', { bold: true, size: 12 });
  sortedByRating.slice(0, 3).forEach((op, index) => {
    pdf.addText(`${index + 1}. ${op.operator_name} - ${op.performance_rating.toFixed(1)}/5.0`, { size: 11, indent: 5 });
  });
  pdf.addText('');
  
  pdf.addText('Top por Servicios Realizados:', { bold: true, size: 12 });
  sortedByServices.slice(0, 3).forEach((op, index) => {
    pdf.addText(`${index + 1}. ${op.operator_name} - ${op.services_count} servicios`, { size: 11, indent: 5 });
  });
  
  // Footer
  pdf.addText('');
  pdf.addText(`${companyConfig.name} - ${companyConfig.address}`, { size: 8 });
  pdf.addText(`Tel: ${companyConfig.phone} | Email: ${companyConfig.email}`, { size: 8 });
  
  return pdf.getBlob();
}
