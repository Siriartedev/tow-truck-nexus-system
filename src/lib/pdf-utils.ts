
import jsPDF from 'jspdf';

export interface PDFOptions {
  title: string;
  filename: string;
  orientation?: 'portrait' | 'landscape';
  format?: 'a4' | 'letter';
}

export class PDFGenerator {
  private doc: jsPDF;
  private yPosition: number = 20;
  private margin: number = 20;
  private pageWidth: number;
  private pageHeight: number;

  constructor(options: Partial<PDFOptions> = {}) {
    this.doc = new jsPDF({
      orientation: options.orientation || 'portrait',
      unit: 'mm',
      format: options.format || 'a4'
    });
    
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.pageHeight = this.doc.internal.pageSize.getHeight();
  }

  addHeader(title: string, subtitle?: string): void {
    // Logo/Company name
    this.doc.setFontSize(20);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('SISTEMA DE GRÚAS', this.margin, this.yPosition);
    
    this.yPosition += 10;
    
    // Title
    this.doc.setFontSize(16);
    this.doc.text(title, this.margin, this.yPosition);
    
    if (subtitle) {
      this.yPosition += 8;
      this.doc.setFontSize(12);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(subtitle, this.margin, this.yPosition);
    }
    
    this.yPosition += 15;
    this.addHorizontalLine();
  }

  addHorizontalLine(): void {
    this.doc.line(this.margin, this.yPosition, this.pageWidth - this.margin, this.yPosition);
    this.yPosition += 10;
  }

  addText(text: string, options: { bold?: boolean; size?: number; indent?: number } = {}): void {
    this.doc.setFontSize(options.size || 10);
    this.doc.setFont('helvetica', options.bold ? 'bold' : 'normal');
    
    const x = this.margin + (options.indent || 0);
    const lines = this.doc.splitTextToSize(text, this.pageWidth - this.margin * 2 - (options.indent || 0));
    
    lines.forEach((line: string) => {
      if (this.yPosition > this.pageHeight - 30) {
        this.doc.addPage();
        this.yPosition = 20;
      }
      this.doc.text(line, x, this.yPosition);
      this.yPosition += 6;
    });
  }

  addTable(headers: string[], rows: string[][]): void {
    const startY = this.yPosition;
    const colWidth = (this.pageWidth - this.margin * 2) / headers.length;
    
    // Headers
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    headers.forEach((header, index) => {
      this.doc.text(header, this.margin + (index * colWidth), startY);
    });
    
    this.yPosition = startY + 8;
    this.addHorizontalLine();
    
    // Rows
    this.doc.setFont('helvetica', 'normal');
    rows.forEach(row => {
      if (this.yPosition > this.pageHeight - 30) {
        this.doc.addPage();
        this.yPosition = 20;
      }
      
      row.forEach((cell, index) => {
        const lines = this.doc.splitTextToSize(cell, colWidth - 2);
        this.doc.text(lines[0] || '', this.margin + (index * colWidth), this.yPosition);
      });
      
      this.yPosition += 6;
    });
    
    this.yPosition += 5;
  }

  addFooter(text: string): void {
    const footerY = this.pageHeight - 20;
    this.doc.setFontSize(8);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(text, this.margin, footerY);
    this.doc.text(`Generado el: ${new Date().toLocaleDateString('es-ES')}`, this.pageWidth - this.margin - 40, footerY);
  }

  save(filename: string): void {
    this.doc.save(filename);
  }

  getBlob(): Blob {
    return this.doc.output('blob');
  }

  getDataUrl(): string {
    return this.doc.output('dataurlstring');
  }
}
