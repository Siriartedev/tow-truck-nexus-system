
import { PDFGenerator } from '../pdf-utils';
import type { FinancialReportData } from '@/types/reports';
import type { CompanyConfig } from '@/types/configuration';

export function generateFinancialReportPDF(
  reportData: FinancialReportData,
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
  
  pdf.addText('REPORTE FINANCIERO', { bold: true, size: 18 });
  pdf.addText('');
  pdf.addHorizontalLine();
  
  // Información del reporte
  const currentDate = new Date();
  pdf.addText(`Fecha de generación: ${currentDate.toLocaleString('es-ES')}`, { size: 12 });
  pdf.addText(`Período: ${reportData.period}`, { size: 12 });
  pdf.addText('');
  
  // Métricas financieras principales
  pdf.addText('MÉTRICAS FINANCIERAS', { bold: true, size: 14 });
  pdf.addText('');
  
  const financialTable = [
    ['Ingresos Totales:', `$${reportData.total_revenue.toLocaleString()}`],
    ['Total Comisiones:', `$${reportData.total_commissions.toLocaleString()}`],
    ['Ganancia Neta:', `$${reportData.net_profit.toLocaleString()}`],
    ['Margen de Ganancia:', `${Math.round((reportData.net_profit / reportData.total_revenue) * 100)}%`],
    ['Servicios Facturados:', reportData.services_count.toString()],
    ['Clientes Activos:', reportData.clients_count.toString()],
    ['Valor Promedio por Servicio:', `$${Math.round(reportData.total_revenue / reportData.services_count).toLocaleString()}`],
    ['Comisión Promedio:', `${Math.round((reportData.total_commissions / reportData.total_revenue) * 100)}%`]
  ];
  
  pdf.addTable(['Concepto', 'Valor'], financialTable);
  pdf.addText('');
  
  // Análisis de rentabilidad
  pdf.addText('ANÁLISIS DE RENTABILIDAD', { bold: true, size: 14 });
  pdf.addText('');
  
  const profitMargin = (reportData.net_profit / reportData.total_revenue) * 100;
  const commissionRate = (reportData.total_commissions / reportData.total_revenue) * 100;
  
  pdf.addText(`El margen de ganancia del ${profitMargin.toFixed(1)}% indica una buena rentabilidad operacional.`, { size: 12 });
  pdf.addText(`Las comisiones representan el ${commissionRate.toFixed(1)}% de los ingresos brutos.`, { size: 12 });
  pdf.addText(`El valor promedio por servicio es de $${Math.round(reportData.total_revenue / reportData.services_count).toLocaleString()}.`, { size: 12 });
  pdf.addText('');
  
  // Proyecciones (ejemplo)
  pdf.addText('PROYECCIONES MENSUALES', { bold: true, size: 14 });
  pdf.addText('');
  
  const monthlyRevenue = reportData.total_revenue;
  const projectedTable = [
    ['Ingresos Mensuales:', `$${monthlyRevenue.toLocaleString()}`],
    ['Proyección Trimestral:', `$${(monthlyRevenue * 3).toLocaleString()}`],
    ['Proyección Anual:', `$${(monthlyRevenue * 12).toLocaleString()}`],
    ['Ganancia Neta Anual:', `$${(reportData.net_profit * 12).toLocaleString()}`]
  ];
  
  pdf.addTable(['Período', 'Proyección'], projectedTable);
  
  // Footer
  pdf.addText('');
  pdf.addText(`${companyConfig.name} - ${companyConfig.address}`, { size: 8 });
  pdf.addText(`Tel: ${companyConfig.phone} | Email: ${companyConfig.email}`, { size: 8 });
  
  return pdf.getBlob();
}
