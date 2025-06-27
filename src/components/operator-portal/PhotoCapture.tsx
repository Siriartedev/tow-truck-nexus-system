
import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, Upload, X, Eye } from 'lucide-react';
import { ServiceInspection, ServicePhoto, PHOTO_TYPES } from '@/types/operator-portal';
import { toast } from 'sonner';

interface PhotoCaptureProps {
  inspection: ServiceInspection;
  onUpdate: (inspection: ServiceInspection) => void;
}

export default function PhotoCapture({ inspection, onUpdate }: PhotoCaptureProps) {
  const [selectedPhotoType, setSelectedPhotoType] = useState<string | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState<ServicePhoto | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoCapture = (photoType: string) => {
    setSelectedPhotoType(photoType);
    if (fileInputRef.current) {
      fileInputRef.current.accept = 'image/*';
      fileInputRef.current.capture = 'environment'; // Usar cámara trasera por defecto
      fileInputRef.current.click();
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedPhotoType) return;

    // Validar que sea una imagen
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona un archivo de imagen válido');
      return;
    }

    // Validar tamaño máximo (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen es demasiado grande. Máximo 5MB');
      return;
    }

    const newPhoto: ServicePhoto = {
      id: crypto.randomUUID(),
      type: selectedPhotoType as any,
      file: file,
      url: URL.createObjectURL(file),
      timestamp: new Date().toISOString()
    };

    // Actualizar o agregar foto
    const updatedPhotos = inspection.photos.filter(p => p.type !== selectedPhotoType);
    updatedPhotos.push(newPhoto);

    onUpdate({
      ...inspection,
      photos: updatedPhotos
    });

    toast.success(`Fotografía ${PHOTO_TYPES.find(t => t.id === selectedPhotoType)?.name} capturada`);
    setSelectedPhotoType(null);
  };

  const handleRemovePhoto = (photoId: string) => {
    const updatedPhotos = inspection.photos.filter(p => p.id !== photoId);
    onUpdate({
      ...inspection,
      photos: updatedPhotos
    });

    toast.success('Fotografía eliminada');
  };

  const handlePreviewPhoto = (photo: ServicePhoto) => {
    setPreviewPhoto(photo);
  };

  const getPhotoForType = (type: string) => {
    return inspection.photos.find(p => p.type === type);
  };

  const totalPhotos = inspection.photos.filter(p => p.file).length;
  const requiredPhotos = PHOTO_TYPES.filter(t => t.required).length;

  return (
    <div className="space-y-6">
      {/* Progress */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Camera className="h-5 w-5 text-blue-600" />
              <span>Fotografías del Vehículo</span>
            </CardTitle>
            <div className="text-sm text-muted-foreground">
              {totalPhotos} de 6 fotografías capturadas
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Progreso de fotografías</span>
              <span className="font-medium">{Math.round((totalPhotos / 6) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(totalPhotos / 6) * 100}%` }}
              />
            </div>
            {totalPhotos < 1 && (
              <p className="text-sm text-orange-600 mt-2">
                ⚠️ Se requiere al menos 1 fotografía para completar la inspección
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Photo Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PHOTO_TYPES.map((photoType) => {
          const photo = getPhotoForType(photoType.id);
          
          return (
            <Card key={photoType.id} className="relative">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{photoType.name}</CardTitle>
                  {photoType.required && (
                    <Badge variant="secondary" className="text-xs">Requerida</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {photo?.url ? (
                  <div className="space-y-3">
                    <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={photo.url}
                        alt={`Foto ${photoType.name}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePreviewPhoto(photo)}
                        className="flex-1"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Ver
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemovePhoto(photo.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                      <div className="text-center">
                        <Camera className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">Sin fotografía</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => handlePhotoCapture(photoType.id)}
                      className="w-full"
                      variant="outline"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Tomar Foto
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Photo Preview Modal */}
      {previewPhoto && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">
                Fotografía {PHOTO_TYPES.find(t => t.id === previewPhoto.type)?.name}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPreviewPhoto(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4">
              <img
                src={previewPhoto.url}
                alt="Vista previa"
                className="max-w-full max-h-[70vh] object-contain mx-auto"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
