
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Download,
  Calendar,
  File,
  Award
} from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: 'invoice' | 'report' | 'certificate';
  size: string;
  created_at: string;
  service_folio?: string;
}

interface DocumentLibraryProps {
  documents: Document[];
  title?: string;
}

export default function DocumentLibrary({ documents, title = "Biblioteca de Documentos" }: DocumentLibraryProps) {
  const [selectedType, setSelectedType] = useState<string>('all');

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'invoice': return FileText;
      case 'report': return File;
      case 'certificate': return Award;
      default: return FileText;
    }
  };

  const getDocumentColor = (type: string) => {
    switch (type) {
      case 'invoice': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'report': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'certificate': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const filteredDocuments = selectedType === 'all' 
    ? documents 
    : documents.filter(doc => doc.type === selectedType);

  const documentTypes = [
    { value: 'all', label: 'Todos', count: documents.length },
    { value: 'invoice', label: 'Facturas', count: documents.filter(d => d.type === 'invoice').length },
    { value: 'report', label: 'Reportes', count: documents.filter(d => d.type === 'report').length },
    { value: 'certificate', label: 'Certificados', count: documents.filter(d => d.type === 'certificate').length },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        <div className="flex space-x-2">
          {documentTypes.map((type) => (
            <Button
              key={type.value}
              variant={selectedType === type.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType(type.value)}
              className="relative"
            >
              {type.label}
              {type.count > 0 && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {type.count}
                </Badge>
              )}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocuments.map((document) => {
          const Icon = getDocumentIcon(document.type);
          return (
            <Card key={document.id} className="bg-card border-border hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon className="h-5 w-5 text-primary" />
                    <Badge className={getDocumentColor(document.type)}>
                      {document.type === 'invoice' ? 'Factura' :
                       document.type === 'report' ? 'Reporte' : 'Certificado'}
                    </Badge>
                  </div>
                </div>
                <CardTitle className="text-base line-clamp-2">
                  {document.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(document.created_at).toLocaleDateString('es-ES')}
                  </div>
                  <span>{document.size}</span>
                </div>
                
                {document.service_folio && (
                  <div className="text-sm text-muted-foreground">
                    Servicio: {document.service_folio}
                  </div>
                )}

                <Button 
                  className="w-full" 
                  size="sm"
                  onClick={() => {
                    // This would trigger the actual download
                    console.log('Downloading:', document.name);
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Descargar PDF
                </Button>
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
              No hay documentos
            </h3>
            <p className="text-muted-foreground">
              Los documentos PDF aparecerán aquí una vez que se generen
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
