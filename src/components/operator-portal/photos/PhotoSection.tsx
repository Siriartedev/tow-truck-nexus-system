
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PhotoCard from './PhotoCard';
import { ServicePhoto } from '@/types/operator-portal';

interface PhotoSectionProps {
  title: string;
  photos: { id: string; name: string; required: boolean }[];
  existingPhotos: ServicePhoto[];
  onTakePhoto: (photoType: string) => void;
  onRemovePhoto: (photoId: string) => void;
}

export default function PhotoSection({ 
  title, 
  photos, 
  existingPhotos, 
  onTakePhoto, 
  onRemovePhoto 
}: PhotoSectionProps) {
  const getPhotoForType = (type: string) => {
    return existingPhotos.find(p => p.type === type);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {photos.map((photoType) => (
            <PhotoCard
              key={photoType.id}
              photoType={photoType}
              existingPhoto={getPhotoForType(photoType.id)}
              onTakePhoto={onTakePhoto}
              onRemovePhoto={onRemovePhoto}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
