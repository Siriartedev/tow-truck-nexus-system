
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Download, 
  Filter,
  FileText,
  File,
  Award,
  Calendar,
  Eye
} from 'lucide-react';
import type { ClientDocument } from '@/types/client-portal';

export default function DocumentsSection() {
  const [searchTerm, setSearchTerm] = useState('');

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

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'invoice': return FileText;
      case 'report': return File;
      case 'certificate': return Award;
      default: return FileText;
    }
  };

  const getDocumentTypeColor = (type: string) => {
    switch (type) {
      case 'invoice': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'report': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'certificate': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getDocumentTypeText = (type: string) => {
    switch (type) {
      case 'invoice': return 'Factura';
      case 'report': return 'Reporte';
      case 'certificate': return 'Certificado';
      default: return type;
    }
  };

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownload = (doc: ClientDocument) => {
    // Simulate download
    console.log('Downloading document:', doc.name);
    // In production, this would handle the actual file download
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Documentos</h2>
          <p className="text-muted-foreground mt-1">Descargue facturas, reportes y certificados</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Facturas</p>
                <p className="text-2xl font-bold text-foreground">
                  {documents.filter(d => d.type === 'invoice').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <File className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Reportes</p>
                <p className="text-2xl font-bold text-foreground">
                  {documents.filter(d => d.type === 'report').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Award className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreforeground">Certificados</p>
                <p className="text-2xl font-bold text-foreground">
                  {documents.filter(d => d.type === 'certificate').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-card border-border">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar documentos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background border-input"
                />
              </div>
            </div>
            <Button variant="outline" className="border-border">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocuments.map((document) => {
          const Icon = getDocumentIcon(document.type);
          return (
            <Card key={document.id} className="bg-card border-border hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon className="h-5 w-5 text-primary" />
                    <Badge className={getDocumentTypeColor(document.type)}>
                      {getDocumentTypeText(document.type)}
                    </Badge>
                  </div>
                </div>
                <CardTitle className="text-base text-foreground line-clamp-2">
                  {document.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  {new Date(document.created_at).toLocaleDateString('es-ES')}
                </div>

                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 border-border"
                    onClick={() => handleDownload(document)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1 bg-primary hover:bg-primary/90"
                    onClick={() => handleDownload(document)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Descargar
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredDocuments.length === 0 && (
        <Card className="bg-card border-border">
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              {searchTerm ? 'No se encontraron documentos' : 'No hay documentos disponibles'}
            </h3>
            <p className="text-muted-foreground">
              {searchTerm 
                ? 'Intente con otros términos de búsqueda'
                : 'Los documentos aparecerán aquí una vez que complete servicios'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
