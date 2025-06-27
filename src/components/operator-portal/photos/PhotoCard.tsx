
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, Upload, X } from 'lucide-react';
import { ServicePhoto } from '@/types/operator-portal';

interface PhotoCardProps {
  photoType: { id: string; name: string; required: boolean };
  existingPhoto?: ServicePhoto;
  onTakePhoto: (photoType: string) => void;
  onRemovePhoto: (photoId: string) => void;
}

export default function PhotoCard({ 
  photoType, 
  existingPhoto, 
  onTakePhoto, 
  onRemovePhoto 
}: PhotoCardProps) {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium">{photoType.name}</h3>
        <Badge 
          variant="secondary" 
          className={`text-xs ${
            photoType.required 
              ? 'bg-blue-100 text-blue-800' 
              : ''
          }`}
        >
          {photoType.required ? 'Recomendada' : 'Opcional'}
        </Badge>
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
              onClick={() => onRemovePhoto(existingPhoto.id)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
          <Button
            variant="outline"
            onClick={() => onTakePhoto(photoType.id)}
            className="w-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            Reemplazar Foto
          </Button>
        </div>
      ) : (
        <Button
          onClick={() => onTakePhoto(photoType.id)}
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
}
