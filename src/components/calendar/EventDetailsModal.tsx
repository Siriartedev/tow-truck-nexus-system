
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Truck, 
  Building,
  Edit,
  Trash2,
  AlertCircle
} from 'lucide-react';
import type { CalendarEvent } from '@/types/calendar';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface EventDetailsModalProps {
  event: CalendarEvent;
  onClose: () => void;
  onEdit: (event: CalendarEvent) => void;
  onDelete: (eventId: string) => void;
}

export default function EventDetailsModal({ event, onClose, onEdit, onDelete }: EventDetailsModalProps) {
  const getEventTypeText = (type: string) => {
    switch (type) {
      case 'service': return 'Servicio';
      case 'maintenance': return 'Mantenimiento';
      case 'meeting': return 'Reunión';
      case 'other': return 'Otro';
      default: return type;
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'service': return 'bg-green-100 text-green-800 border-green-200';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'meeting': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'other': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Media';
      case 'low': return 'Baja';
      default: return priority;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled': return 'Programado';
      case 'in_progress': return 'En Progreso';
      case 'completed': return 'Completado';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center space-x-3">
            <CardTitle className="text-xl font-bold">{event.title}</CardTitle>
            <Badge className={getEventTypeColor(event.event_type)}>
              {getEventTypeText(event.event_type)}
            </Badge>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Event Description */}
          {event.description && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Descripción</h4>
              <p className="text-gray-600">{event.description}</p>
            </div>
          )}

          {/* Event Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                <span className="font-medium">Fecha:</span>
                <span className="ml-2">
                  {format(new Date(event.start_date), 'PPP', { locale: es })}
                  {event.start_date !== event.end_date && (
                    <> - {format(new Date(event.end_date), 'PPP', { locale: es })}</>
                  )}
                </span>
              </div>

              {!event.all_day && (
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="font-medium">Hora:</span>
                  <span className="ml-2">{event.start_time} - {event.end_time}</span>
                </div>
              )}

              {event.location && (
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="font-medium">Ubicación:</span>
                  <span className="ml-2">{event.location}</span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <AlertCircle className="h-4 w-4 mr-2 text-gray-500" />
                <span className="font-medium">Prioridad:</span>
                <Badge className={`ml-2 ${getPriorityColor(event.priority)}`}>
                  {getPriorityText(event.priority)}
                </Badge>
              </div>

              <div className="flex items-center text-sm">
                <AlertCircle className="h-4 w-4 mr-2 text-gray-500" />
                <span className="font-medium">Estado:</span>
                <Badge className={`ml-2 ${getStatusColor(event.status)}`}>
                  {getStatusText(event.status)}
                </Badge>
              </div>
            </div>
          </div>

          {/* Service Details */}
          {event.event_type === 'service' && (
            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-3">Detalles del Servicio</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {event.client_name && (
                  <div className="flex items-center text-sm">
                    <Building className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="font-medium">Cliente:</span>
                    <span className="ml-2">{event.client_name}</span>
                  </div>
                )}

                {event.operator_name && (
                  <div className="flex items-center text-sm">
                    <User className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="font-medium">Operador:</span>
                    <span className="ml-2">{event.operator_name}</span>
                  </div>
                )}

                {event.crane_name && (
                  <div className="flex items-center text-sm md:col-span-2">
                    <Truck className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="font-medium">Grúa:</span>
                    <span className="ml-2">{event.crane_name}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="border-t pt-4 text-xs text-gray-500">
            <div>Creado: {format(new Date(event.created_at), 'PPpp', { locale: es })}</div>
            <div>Actualizado: {format(new Date(event.updated_at), 'PPpp', { locale: es })}</div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => onEdit(event)}
              className="flex items-center"
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
            <Button
              variant="outline"
              onClick={() => onDelete(event.id)}
              className="text-red-600 hover:text-red-700 flex items-center"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
