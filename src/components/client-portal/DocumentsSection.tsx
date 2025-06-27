
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { ClientDocument } from '@/types/client-portal';
import { usePDFGenerator } from '@/hooks/usePDFGenerator';
import DocumentsSummaryCards from './documents/DocumentsSummaryCards';
import DocumentsFilters from './documents/DocumentsFilters';
import DocumentsGrid from './documents/DocumentsGrid';
import EmptyDocumentsState from './documents/EmptyDocumentsState';

export default function DocumentsSection() {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  // Mock data
  const documents: ClientDocument[] = [
    {
      id: '1',
      name: 'Factura SRV-20241220-3390',
      type: 'invoice',
      service_id: '1',
      url: '/documents/invoice-1.pdf',
      created_at: '2024-12-20T10:00:00Z'
    },
    {
      id: '2',
      name: 'Reporte de Servicio - Montaje Industrial',
      type: 'report',
      service_id: '1',
      url: '/documents/report-1.pdf', 
      created_at: '2024-12-20T16:30:00Z'
    },
    {
      id: '3',
      name: 'Certificado de Inspección',
      type: 'certificate',
      service_id: '1',
      url: '/documents/certificate-1.pdf',
      created_at: '2024-12-20T17:00:00Z'
    },
    {
      id: '4',
      name: 'Factura SRV-20241219-2850',
      type: 'invoice',
      service_id: '2',
      url: '/documents/invoice-2.pdf',
      created_at: '2024-12-19T14:00:00Z'
    },
    {
      id: '5',
      name: 'Reporte de Rescate Vehicular',
      type: 'report',
      service_id: '2',
      url: '/documents/report-2.pdf',
      created_at: '2024-12-19T18:45:00Z'
    },
    {
      id: '6',
      name: 'Factura SRV-20241218-1750',
      type: 'invoice',
      service_id: '3',
      url: '/documents/invoice-3.pdf',
      created_at: '2024-12-18T20:00:00Z'
    }
  ];

  const { generateInvoice, generateServiceReport } = usePDFGenerator();

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDownload = async (doc: ClientDocument) => {
    try {
      // Simulate document generation based on type
      if (doc.type === 'invoice') {
        // Mock invoice data for demonstration
        const mockInvoice = {
          id: doc.id,
          folio: doc.name.split(' ')[1] || 'INV-001',
          closure_id: '1',
          closure_folio: 'CIE-001',
          client_id: '1',
          client_name: 'Cliente Demo',
          issue_date: new Date().toISOString().split('T')[0],
          due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          subtotal: 100000,
          tax_rate: 16,
          tax_amount: 16000,
          total_amount: 116000,
          status: 'sent' as const,
          created_at: doc.created_at,
          updated_at: doc.created_at
        };
        await generateInvoice(mockInvoice);
      } else if (doc.type === 'report') {
        // Mock service data for demonstration
        const mockService = {
          id: doc.service_id || '1',
          folio: 'SRV-001',
          client_id: '1',
          client_name: 'Cliente Demo',
          service_type_id: '1',
          service_type_name: 'Traslado de Vehículo',
          crane_id: '1',
          crane_name: 'Grúa Mercedes-Benz',
          operator_id: '1',
          operator_name: 'Juan Pérez',
          request_date: new Date().toISOString().split('T')[0],
          service_date: new Date().toISOString().split('T')[0],
          pickup_location: 'Ubicación de origen',
          delivery_location: 'Ubicación de destino',
          vehicle_brand: 'Toyota',
          vehicle_model: 'Corolla',
          license_plate: 'ABC-123',
          service_value: 100000,
          operator_commission: 20000,
          status: 'completed' as const,
          observations: 'Servicio completado satisfactoriamente',
          created_at: doc.created_at,
          updated_at: doc.created_at
        };
        await generateServiceReport(mockService);
      } else {
        // For other document types, show a message
        toast({
          title: "Funcionalidad en desarrollo",
          description: "La descarga de este tipo de documento estará disponible pronto.",
        });
      }
    } catch (error) {
      console.error('Error downloading document:', error);
      toast({
        title: "Error",
        description: "No se pudo descargar el documento. Intente nuevamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Documentos</h2>
          <p className="text-muted-foreground mt-1">Descargue facturas, reportes y certificados</p>
        </div>
      </div>

      <DocumentsSummaryCards documents={documents} />

      <DocumentsFilters 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm} 
      />

      {filteredDocuments.length === 0 ? (
        <EmptyDocumentsState searchTerm={searchTerm} />
      ) : (
        <DocumentsGrid 
          documents={filteredDocuments} 
          onViewDownload={handleViewDownload} 
        />
      )}
    </div>
  );
}
