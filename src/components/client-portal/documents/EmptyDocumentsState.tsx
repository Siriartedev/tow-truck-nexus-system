
import { Card, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';

interface EmptyDocumentsStateProps {
  searchTerm: string;
}

export default function EmptyDocumentsState({ searchTerm }: EmptyDocumentsStateProps) {
  return (
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
  );
}
