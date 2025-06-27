
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { ServiceInspection, ServicePhoto, PHOTO_TYPES } from '@/types/operator-portal';
import PhotoProgress from './photos/PhotoProgress';
import PhotoSection from './photos/PhotoSection';
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

  const requiredPhotos = PHOTO_TYPES.filter(t => t.required);
  const optionalPhotos = PHOTO_TYPES.filter(t => !t.required);
  const hasMinimumPhotos = inspection.photos.filter(p => p.file).length >= 1;

  return (
    <div className="space-y-6">
      <PhotoProgress inspection={inspection} />

      <PhotoSection
        title="Fotografías Recomendadas"
        photos={requiredPhotos}
        existingPhotos={inspection.photos}
        onTakePhoto={triggerFileInput}
        onRemovePhoto={handleRemovePhoto}
      />

      <PhotoSection
        title="Fotografías Opcionales"
        photos={optionalPhotos}
        existingPhotos={inspection.photos}
        onTakePhoto={triggerFileInput}
        onRemovePhoto={handleRemovePhoto}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        onChange={(e) => activePhotoType && handleFileSelect(e, activePhotoType)}
      />

      <div className="flex justify-between pt-6">
        <Button onClick={onPrevious} variant="outline" size="lg" className="flex items-center space-x-2">
          <ArrowLeft className="h-4 w-4" />
          <span>Volver a Inventario</span>
        </Button>
        <Button 
          onClick={onNext} 
          size="lg" 
          disabled={!hasMinimumPhotos}
          className="flex items-center space-x-2"
        >
          <span>Continuar a Firmas</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
