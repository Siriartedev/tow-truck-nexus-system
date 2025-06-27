
import { PDFGenerator } from '../pdf-utils';
import type { Invoice } from '@/types/invoices';

export function generateInvoicePDF(invoice: Invoice): Blob {
  const pdf = new PDFGenerator();
  
  pdf.addHeader(
    'FACTURA',
    `Folio: ${invoice.folio}`
  );

  // Client information
  pdf.addText('DATOS DEL CLIENTE', { bold: true, size: 12 });
  pdf.addText(`Cliente: ${invoice.client_name}`, { indent: 5 });
  pdf.addText(`Fecha de emisión: ${new Date(invoice.issue_date).toLocaleDateString('es-ES')}`, { indent: 5 });
  pdf.addText(`Fecha de vencimiento: ${new Date(invoice.due_date).toLocaleDateString('es-ES')}`, { indent: 5 });
  pdf.addText('');

  // Service details
  pdf.addText('DETALLES DEL SERVICIO', { bold: true, size: 12 });
  pdf.addText(`Cierre asociado: ${invoice.closure_folio}`, { indent: 5 });
  pdf.addText('');

  // Financial breakdown
  pdf.addTable(
    ['Concepto', 'Importe'],
    [
      ['Subtotal', `$${invoice.subtotal.toLocaleString()}`],
      [`IVA (${invoice.tax_rate}%)`, `$${invoice.tax_amount.toLocaleString()}`],
      ['TOTAL', `$${invoice.total_amount.toLocaleString()}`]
    ]
  );

  // Payment status
  pdf.addText('');
  pdf.addText('ESTADO DE PAGO', { bold: true, size: 12 });
  const statusText = invoice.status === 'paid' 
    ? `PAGADA - Fecha de pago: ${invoice.payment_date ? new Date(invoice.payment_date).toLocaleDateString('es-ES') : 'N/A'}`
    : `PENDIENTE - Vence: ${new Date(invoice.due_date).toLocaleDateString('es-ES')}`;
  pdf.addText(statusText, { indent: 5 });

  if (invoice.observations) {
    pdf.addText('');
    pdf.addText('OBSERVACIONES', { bold: true, size: 12 });
    pdf.addText(invoice.observations, { indent: 5 });
  }

  pdf.addFooter('Factura generada automáticamente por Sistema de Grúas');

  return pdf.getBlob();
}
