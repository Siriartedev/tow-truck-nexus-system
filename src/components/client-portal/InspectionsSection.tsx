
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Camera, 
  Eye,
  Calendar,
  FileText,
  Image as ImageIcon,
  ZoomIn
} from 'lucide-react';
import type { ClientInspection } from '@/types/client-portal';

export default function InspectionsSection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInspection, setSelectedInspection] = useState<ClientInspection | null>(null);

  // Mock data
  const inspections: ClientInspection[] = [
    {
      id: '1',
      service_id: '1',
      title: 'Inspección Previa - Montaje Industrial',
      description: 'Inspección del equipo antes del montaje industrial. Se verificó el estado de la maquinaria y las condiciones del sitio.',
      photos: [
        '/images/inspection-1-1.jpg',
        '/images/inspection-1-2.jpg',
        '/images/inspection-1-3.jpg',
        '/images/inspection-1-4.jpg'
      ],
      created_at: '2024-12-22T08:00:00Z'
    },
    {
      id: '2',
      service_id: '1',
      title: 'Inspección Post-Montaje',
      description: 'Verificación del montaje completado. Todas las conexiones fueron revisadas y aprobadas.',
      photos: [
        '/images/inspection-2-1.jpg',
        '/images/inspection-2-2.jpg',
        '/images/inspection-2-3.jpg'
      ],
      created_at: '2024-12-22T16:30:00Z'
    },
    {
      id: '3',
      service_id: '2',
      title: 'Inspección de Rescate Vehicular',
      description: 'Documentación del estado del vehículo rescatado y proceso de extracción.',
      photos: [
        '/images/inspection-3-1.jpg',
        '/images/inspection-3-2.jpg'
      ],
      created_at: '2024-12-19T15:00:00Z'
    },
    {
      id: '4',
      service_id: '3',
      title: 'Inspección de Equipo - Traslado',
      description: 'Verificación del equipo antes y después del traslado. Documentación de condiciones.',
      photos: [
        '/images/inspection-4-1.jpg',
        '/images/inspection-4-2.jpg',
        '/images/inspection-4-3.jpg',
        '/images/inspection-4-4.jpg',
        '/images/inspection-4-5.jpg'
      ],
      created_at: '2024-12-20T14:20:00Z'
    }
  ];

  const filteredInspections = inspections.filter(inspection =>
    inspection.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inspection.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Inspecciones</h2>
          <p className="text-muted-foreground mt-1">Galería de fotos e informes de inspección</p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Camera className="h-6 w-6 text-primary" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Inspecciones</p>
                <p className="text-2xl font-bold text-foreground">{inspections.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <ImageIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Fotos</p>
                <p className="text-2xl font-bold text-foreground">
                  {inspections.reduce((sum, inspection) => sum + inspection.photos.length, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Este Mes</p>
                <p className="text-2xl font-bold text-foreground">
                  {inspections.filter(i => 
                    new Date(i.created_at).getMonth() === new Date().getMonth()
                  ).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="bg-card border-border">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar inspecciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background border-input"
            />
          </div>
        </CardContent>
      </Card>

      {/* Inspections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredInspections.map((inspection) => (
          <Card key={inspection.id} className="bg-card border-border hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Camera className="h-4 w-4 text-primary" />
                  <Badge variant="outline" className="border-primary/30 text-primary">
                    {inspection.photos.length} fotos
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-border"
                  onClick={() => setSelectedInspection(inspection)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Galería
                </Button>
              </div>
              <CardTitle className="text-lg text-foreground">{inspection.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{inspection.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                {new Date(inspection.created_at).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>

              {/* Photo Preview Grid */}
              <div className="grid grid-cols-4 gap-2">
                {inspection.photos.slice(0, 4).map((photo, index) => (
                  <div
                    key={index}
                    className="aspect-square bg-muted rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setSelectedInspection(inspection)}
                  >
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                      <ImageIcon className="h-6 w-6 text-muted-foreground" />
                    </div>
                    {index === 3 && inspection.photos.length > 4 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                        <span className="text-white font-medium text-sm">
                          +{inspection.photos.length - 4}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredInspections.length === 0 && (
        <Card className="bg-card border-border">
          <CardContent className="text-center py-12">
            <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              {searchTerm ? 'No se encontraron inspecciones' : 'No hay inspecciones disponibles'}
            </h3>
            <p className="text-muted-foreground">
              {searchTerm 
                ? 'Intente con otros términos de búsqueda'
                : 'Las inspecciones con fotos aparecerán aquí después de completar servicios'
              }
            </p>
          </CardContent>
        </Card>
      )}

      {/* Photo Gallery Modal */}
      {selectedInspection && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <Card className="max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{selectedInspection.title}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedInspection.description}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedInspection(null)}
              >
                ✕
              </Button>
            </CardHeader>
            <CardContent className="overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedInspection.photos.map((photo, index) => (
                  <div
                    key={index}
                    className="aspect-video bg-muted rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                      <div className="text-center">
                        <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Foto {index + 1}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
