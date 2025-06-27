
import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, Upload, X, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { ServiceInspection, ServicePhoto, PHOTO_TYPES } from '@/types/operator-portal';
import { toast } from 'sonner';

interface PhotoCaptureProps {
  inspection: ServiceInspection;
  onUpdate: (inspection: ServiceInspection) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export default function PhotoCapture({ inspection, onUpdate, onNext, onPrevious }: PhotoCaptureProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activePhotoType, setActivePhotoType] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, photoType: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Solo se permiten archivos de imagen');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen no puede ser mayor a 5MB');
      return;
    }

    const newPhoto: ServicePhoto = {
      id: crypto.randomUUID(),
      type: photoType as any,
      file: file,
      timestamp: new Date().toISOString()
    };

    // Reemplazar foto existente del mismo tipo o agregar nueva
    const updatedPhotos = inspection.photos.filter(p => p.type !== photoType);
    updatedPhotos.push(newPhoto);

    onUpdate({
      ...inspection,
      photos: updatedPhotos
    });

    toast.success(`Foto ${PHOTO_TYPES.find(t => t.id === photoType)?.name} agregada`);
  };

  const handleRemovePhoto = (photoId: string) => {
    const updatedPhotos = inspection.photos.filter(p => p.id !== photoId);
    onUpdate({
      ...inspection,
      photos: updatedPhotos
    });
    toast.success('Foto eliminada');
  };

  const triggerFileInput = (photoType: string) => {
    setActivePhotoType(photoType);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const getPhotoForType = (type: string) => {
    return inspection.photos.find(p => p.type === type);
  };

  const requiredPhotos = PHOTO_TYPES.filter(t => t.required);
  const optionalPhotos = PHOTO_TYPES.filter(t => !t.required);
  const hasRequiredPhotos = requiredPhotos.every(type => getPhotoForType(type.id));

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Camera className="h-5 w-5 text-blue-600" />
            <span>Captura de Fotografías</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Toma fotografías del vehículo desde diferentes ángulos. Las marcadas como requeridas son obligatorias.
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-sm">
              Fotos tomadas: {inspection.photos.length} de {PHOTO_TYPES.length}
            </div>
            <div className="flex items-center space-x-2">
              {hasRequiredPhotos ? (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Fotos requeridas completas
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  Faltan fotos requeridas
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Required Photos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Fotografías Requeridas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {requiredPhotos.map((photoType) => {
              const existingPhoto = getPhotoForType(photoType.id);
              return (
                <div key={photoType.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium">{photoType.name}</h3>
                    <Badge variant="destructive" className="text-xs">Requerida</Badge>
                  </div>
                  
                  {existingPhoto ? (
                    <div className="space-y-3">
                      <div className="relative">
                        <img
                          src={URL.createObjectURL(existingPhoto.file!)}
                          alt={photoType.name}
                          className="w-full h-32 object-cover rounded border"
                        />
                        <button
                          onClick={() => handleRemovePhoto(existingPhoto.id)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => triggerFileInput(photoType.id)}
                        className="w-full"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Reemplazar Foto
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => triggerFileInput(photoType.id)}
                      className="w-full h-32 border-2 border-dashed border-gray-300 hover:border-gray-400"
                      variant="ghost"
                    >
                      <div className="text-center">
                        <Camera className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <span className="text-sm text-gray-500">Tomar Foto</span>
                      </div>
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Optional Photos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Fotografías Opcionales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {optionalPhotos.map((photoType) => {
              const existingPhoto = getPhotoForType(photoType.id);
              return (
                <div key={photoType.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium">{photoType.name}</h3>
                    <Badge variant="secondary" className="text-xs">Opcional</Badge>
                  </div>
                  
                  {existingPhoto ? (
                    <div className="space-y-3">
                      <div className="relative">
                        <img
                          src={URL.createObjectURL(existingPhoto.file!)}
                          alt={photoType.name}
                          className="w-full h-32 object-cover rounded border"
                        />
                        <button
                          onClick={() => handleRemovePhoto(existingPhoto.id)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => triggerFileInput(photoType.id)}
                        className="w-full"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Reemplazar Foto
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => triggerFileInput(photoType.id)}
                      className="w-full h-32 border-2 border-dashed border-gray-300 hover:border-gray-400"
                      variant="ghost"
                    >
                      <div className="text-center">
                        <Camera className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <span className="text-sm text-gray-500">Tomar Foto</span>
                      </div>
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        onChange={(e) => activePhotoType && handleFileSelect(e, activePhotoType)}
      />

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button onClick={onPrevious} variant="outline" size="lg" className="flex items-center space-x-2">
          <ArrowLeft className="h-4 w-4" />
          <span>Volver a Inventario</span>
        </Button>
        <Button 
          onClick={onNext} 
          size="lg" 
          disabled={!hasRequiredPhotos}
          className="flex items-center space-x-2"
        >
          <span>Continuar a Firmas</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
