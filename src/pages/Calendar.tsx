
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { 
  Calendar as CalendarIcon,
  Plus,
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  List,
  Clock,
  MapPin,
  User,
  Truck,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import CreateEventForm from '@/components/calendar/CreateEventForm';
import EventDetailsModal from '@/components/calendar/EventDetailsModal';
import type { CalendarEvent, CreateEventData, CalendarView } from '@/types/calendar';
import { format, addDays, addWeeks, addMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isSameMonth, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>('month');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  // Mock data
  const events: CalendarEvent[] = [
    {
      id: '1',
      title: 'Servicio de Montaje Industrial',
      description: 'Montaje de estructura metálica',
      start_date: '2024-12-22',
      end_date: '2024-12-22',
      start_time: '08:00',
      end_time: '16:00',
      event_type: 'service',
      service_id: '1',
      client_id: '1',
      client_name: 'Constructora ABC',
      operator_id: '1',
      operator_name: 'Juan Pérez',
      crane_id: '1',
      crane_name: 'Grúa Liebherr LTM 1050',
      location: 'Polígono Industrial Norte',
      priority: 'high',
      status: 'scheduled',
      color: '#22c55e',
      created_at: '2024-12-20T10:00:00Z',
      updated_at: '2024-12-20T10:00:00Z'
    },
    {
      id: '2',
      title: 'Mantenimiento Preventivo',
      description: 'Revisión general de grúa',
      start_date: '2024-12-23',
      end_date: '2024-12-23',
      start_time: '09:00',
      end_time: '12:00',
      event_type: 'maintenance',
      crane_id: '2',
      crane_name: 'Grúa Tadano GT-550E',
      location: 'Taller Principal',
      priority: 'medium',
      status: 'scheduled',
      color: '#f59e0b',
      created_at: '2024-12-19T14:30:00Z',
      updated_at: '2024-12-19T14:30:00Z'
    },
    {
      id: '3',
      title: 'Reunión con Cliente',
      description: 'Revisión de proyecto de construcción',
      start_date: '2024-12-24',
      end_date: '2024-12-24',
      start_time: '14:00',
      end_time: '15:30',
      event_type: 'meeting',
      client_id: '3',
      client_name: 'Transportes Norte',
      location: 'Oficinas Centrales',
      priority: 'medium',
      status: 'scheduled',
      color: '#3b82f6',
      created_at: '2024-12-18T16:00:00Z',
      updated_at: '2024-12-18T16:00:00Z'
    }
  ];

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

  const handleCreateEvent = (data: CreateEventData) => {
    console.log('Creating event:', data);
    toast({
      title: "Evento creado",
      description: "El evento ha sido creado exitosamente.",
    });
    setShowCreateForm(false);
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setEditingEvent(event);
    setShowCreateForm(true);
  };

  const handleDeleteEvent = (eventId: string) => {
    console.log('Deleting event:', eventId);
    toast({
      title: "Evento eliminado",
      description: "El evento ha sido eliminado exitosamente.",
    });
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    if (view === 'month') {
      setCurrentDate(direction === 'next' ? addMonths(currentDate, 1) : addMonths(currentDate, -1));
    } else if (view === 'week') {
      setCurrentDate(direction === 'next' ? addWeeks(currentDate, 1) : addWeeks(currentDate, -1));
    } else {
      setCurrentDate(direction === 'next' ? addDays(currentDate, 1) : addDays(currentDate, -1));
    }
  };

  const getCalendarDays = () => {
    if (view === 'month') {
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);
      const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
      const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
      return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
    } else if (view === 'week') {
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
      return eachDayOfInterval({ start: weekStart, end: weekEnd });
    } else {
      return [currentDate];
    }
  };

  const getEventsForDay = (date: Date) => {
    return events.filter(event => isSameDay(parseISO(event.start_date), date));
  };

  const formatViewTitle = () => {
    if (view === 'month') {
      return format(currentDate, 'MMMM yyyy', { locale: es });
    } else if (view === 'week') {
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
      return `${format(weekStart, 'd MMM', { locale: es })} - ${format(weekEnd, 'd MMM yyyy', { locale: es })}`;
    } else {
      return format(currentDate, 'EEEE, d MMMM yyyy', { locale: es });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calendario</h1>
          <p className="text-gray-600 mt-1">Gestiona eventos y servicios programados</p>
        </div>
        <Button 
          className="bg-green-600 hover:bg-green-700"
          onClick={() => setShowCreateForm(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Evento
        </Button>
      </div>

      {/* Calendar Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigateDate('prev')}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigateDate('next')}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <h2 className="text-xl font-semibold capitalize">{formatViewTitle()}</h2>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant={view === 'day' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setView('day')}
                className={view === 'day' ? 'bg-green-600' : ''}
              >
                <Clock className="h-4 w-4 mr-1" />
                Día
              </Button>
              <Button
                variant={view === 'week' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setView('week')}
                className={view === 'week' ? 'bg-green-600' : ''}
              >
                <List className="h-4 w-4 mr-1" />
                Semana
              </Button>
              <Button
                variant={view === 'month' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setView('month')}
                className={view === 'month' ? 'bg-green-600' : ''}
              >
                <Grid3X3 className="h-4 w-4 mr-1" />
                Mes
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-6">
          {view === 'month' && (
            <div className="grid grid-cols-7 gap-1">
              {/* Header Days */}
              {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => (
                <div key={day} className="p-2 text-center font-medium text-gray-600 border-b">
                  {day}
                </div>
              ))}
              
              {/* Calendar Days */}
              {getCalendarDays().map((date) => {
                const dayEvents = getEventsForDay(date);
                const isCurrentMonth = isSameMonth(date, currentDate);
                const isToday = isSameDay(date, new Date());
                
                return (
                  <div
                    key={date.toISOString()}
                    className={`min-h-[120px] p-2 border border-gray-200 ${
                      !isCurrentMonth ? 'bg-gray-50' : 'bg-white'
                    } ${isToday ? 'bg-blue-50 border-blue-300' : ''}`}
                  >
                    <div className={`text-sm font-medium mb-1 ${
                      !isCurrentMonth ? 'text-gray-400' : isToday ? 'text-blue-600' : 'text-gray-900'
                    }`}>
                      {format(date, 'd')}
                    </div>
                    <div className="space-y-1">
                      {dayEvents.slice(0, 3).map((event) => (
                        <div
                          key={event.id}
                          className={`text-xs p-1 rounded cursor-pointer hover:opacity-80 ${getEventTypeColor(event.event_type)}`}
                          onClick={() => setSelectedEvent(event)}
                        >
                          {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 3 && (
                        <div className="text-xs text-gray-500">
                          +{dayEvents.length - 3} más
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {(view === 'week' || view === 'day') && (
            <div className="space-y-4">
              {getCalendarDays().map((date) => {
                const dayEvents = getEventsForDay(date);
                const isToday = isSameDay(date, new Date());
                
                return (
                  <div key={date.toISOString()} className="border rounded-lg">
                    <div className={`p-3 font-medium border-b ${
                      isToday ? 'bg-blue-50 text-blue-600' : 'bg-gray-50'
                    }`}>
                      {format(date, 'EEEE, d MMMM yyyy', { locale: es })}
                    </div>
                    <div className="p-3 space-y-2">
                      {dayEvents.length === 0 ? (
                        <p className="text-gray-500 text-sm">No hay eventos programados</p>
                      ) : (
                        dayEvents.map((event) => (
                          <div
                            key={event.id}
                            className={`p-3 rounded-lg border ${getEventTypeColor(event.event_type)} cursor-pointer hover:shadow-sm`}
                            onClick={() => setSelectedEvent(event)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium">{event.title}</h4>
                                <div className="flex items-center space-x-4 mt-1 text-sm">
                                  <span className="flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {event.start_time} - {event.end_time}
                                  </span>
                                  {event.location && (
                                    <span className="flex items-center">
                                      <MapPin className="h-3 w-3 mr-1" />
                                      {event.location}
                                    </span>
                                  )}
                                  {event.client_name && (
                                    <span className="flex items-center">
                                      <User className="h-3 w-3 mr-1" />
                                      {event.client_name}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge className={getPriorityColor(event.priority)}>
                                  {event.priority === 'high' ? 'Alta' : event.priority === 'medium' ? 'Media' : 'Baja'}
                                </Badge>
                                <div className="flex space-x-1">
                                  <Button size="sm" variant="outline" onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedEvent(event);
                                  }}>
                                    <Eye className="h-3 w-3" />
                                  </Button>
                                  <Button size="sm" variant="outline" onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditEvent(event);
                                  }}>
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700" onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteEvent(event.id);
                                  }}>
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Event Form Modal */}
      {showCreateForm && (
        <CreateEventForm
          event={editingEvent}
          onClose={() => {
            setShowCreateForm(false);
            setEditingEvent(null);
          }}
          onSubmit={handleCreateEvent}
        />
      )}

      {/* Event Details Modal */}
      {selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onEdit={handleEditEvent}
          onDelete={handleDeleteEvent}
        />
      )}
    </div>
  );
}
