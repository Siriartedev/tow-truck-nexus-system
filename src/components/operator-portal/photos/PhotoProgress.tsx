
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Camera, CheckCircle } from 'lucide-react';
import { ServiceInspection, PHOTO_TYPES } from '@/types/operator-portal';

interface PhotoProgressProps {
  inspection: ServiceInspection;
}

export default function PhotoProgress({ inspection }: PhotoProgressProps) {
  const hasMinimumPhotos = inspection.photos.filter(p => p.file).length >= 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Camera className="h-5 w-5 text-blue-600" />
          <span>Captura de Fotografías</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Toma al menos 1 fotografía del vehículo. Las marcadas como requeridas son recomendadas.
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-sm">
            Fotos tomadas: {inspection.photos.length} de {PHOTO_TYPES.length}
          </div>
          <div className="flex items-center space-x-2">
            {hasMinimumPhotos ? (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Mínimo de fotos completo
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                Se requiere al menos 1 foto
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
