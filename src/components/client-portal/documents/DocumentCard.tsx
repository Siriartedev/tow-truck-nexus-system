
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, File, Award, Calendar, Eye, Download } from 'lucide-react';
import type { ClientDocument } from '@/types/client-portal';

interface DocumentCardProps {
  document: ClientDocument;
  onViewDownload: (document: ClientDocument) => void;
}

export default function DocumentCard({ document, onViewDownload }: DocumentCardProps) {
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

  const Icon = getDocumentIcon(document.type);

  return (
    <Card className="bg-card border-border hover:shadow-lg transition-shadow">
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
            onClick={() => onViewDownload(document)}
          >
            <Eye className="h-4 w-4 mr-2" />
            Ver
          </Button>
          <Button 
            size="sm" 
            className="flex-1 bg-primary hover:bg-primary/90"
            onClick={() => onViewDownload(document)}
          >
            <Download className="h-4 w-4 mr-2" />
            Descargar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
