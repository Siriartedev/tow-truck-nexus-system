
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  X, 
  Calendar as CalendarIcon, 
  User, 
  FileText,
  DollarSign,
  CheckCircle2,
  Clock
} from 'lucide-react';
import type { CreateClosureData } from '@/types/closures';
import type { Service } from '@/types/services';

interface CreateClosureFormProps {
  onClose: () => void;
  onSubmit: (data: CreateClosureData) => void;
}

export default function CreateClosureForm({ onClose, onSubmit }: CreateClosureFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<CreateClosureData>>({
    service_ids: []
  });
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  // Mock clients data
  const clients = [
    { id: '1', name: 'Constructora ABC' },
    { id: '2', name: 'Empresa XYZ' },
    { id: '3', name: 'Transportes Norte' },
  ];

  // Mock services data (completed services not yet closed)
  const availableServices: Service[] = [
    {
      id: '1',
      folio: 'SRV-20241220-3390',
      client_id: '1',
      client_name: 'Constructora ABC',
      service_type_id: '1',
      service_type_name: 'Montaje Industrial',
      crane_id: '1',
      crane_name: 'Grúa Liebherr LTM 1050',
      operator_id: '1',
      operator_name: 'Juan Pérez',
      request_date: '2024-12-20',
      service_date: '2024-12-22',
      pickup_location: 'Av. Industrial 123',
      delivery_location: 'Polígono Industrial Norte',
      service_value: 150000,
      operator_commission: 15000,
      status: 'completed',
      created_at: '2024-12-20T10:00:00Z',
      updated_at: '2024-12-20T10:00:00Z'
    },
    {
      id: '2',
      folio: 'SRV-20241221-4400',
      client_id: '1',
      client_name: 'Constructora ABC',
      service_type_id: '2',
      service_type_name: 'Rescate Vehicular',
      crane_id: '2',
      crane_name: 'Grúa Tadano GT-550E',
      operator_id: '2',
      operator_name: 'María González',
      request_date: '2024-12-21',
      service_date: '2024-12-21',
      pickup_location: 'Carretera Nacional Km 15',
      delivery_location: 'Taller Mecánico Central',
      service_value: 80000,
      operator_commission: 8000,
      status: 'completed',
      created_at: '2024-12-21T08:30:00Z',
      updated_at: '2024-12-21T15:45:00Z'
    }
  ];

  const filteredServices = availableServices.filter(service => {
    if (!formData.client_id) return false;
    if (service.client_id !== formData.client_id) return false;
    if (!startDate || !endDate) return true;
    
    const serviceDate = new Date(service.service_date);
    return serviceDate >= startDate && serviceDate <= endDate;
  });

  const selectedServicesData = filteredServices.filter(service => 
    selectedServices.includes(service.id)
  );

  const totalValue = selectedServicesData.reduce((sum, service) => sum + service.service_value, 0);
  const totalCommission = selectedServicesData.reduce((sum, service) => sum + service.operator_commission, 0);

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleNext = () => {
    if (step < 3) {
      if (step === 1 && (!formData.client_id || !startDate || !endDate)) return;
      if (step === 2 && selectedServices.length === 0) return;
      setStep(step + 1);
    }
  };

  const handleSubmit = () => {
    if (!formData.client_id || !startDate || !endDate || selectedServices.length === 0) return;

    const submitData: CreateClosureData = {
      client_id: formData.client_id,
      start_date: format(startDate, 'yyyy-MM-dd'),
      end_date: format(endDate, 'yyyy-MM-dd'),
      service_ids: selectedServices,
      observations: formData.observations
    };

    onSubmit(submitData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-xl text-foreground">Crear Nuevo Cierre</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Paso {step} de 3: {step === 1 ? 'Información General' : step === 2 ? 'Selección de Servicios' : 'Confirmación'}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Step Progress */}
          <div className="flex items-center mb-6">
            {[1, 2, 3].map((stepNumber) => (
              <React.Fragment key={stepNumber}>
                <div className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium",
                  stepNumber <= step 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted text-muted-foreground"
                )}>
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={cn(
                    "flex-1 h-1 mx-2",
                    stepNumber < step ? "bg-primary" : "bg-muted"
                  )} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Step 1: General Information */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="client">Cliente *</Label>
                  <select
                    id="client"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={formData.client_id || ''}
                    onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                  >
                    <option value="">Seleccionar cliente</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>{client.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Fecha de Inicio *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP", { locale: es }) : "Seleccionar fecha"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Fecha de Fin *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP", { locale: es }) : "Seleccionar fecha"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                        disabled={(date) => startDate ? date < startDate : false}
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Service Selection */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-foreground">Seleccionar Servicios</h3>
                <Badge variant="outline">
                  {filteredServices.length} servicios disponibles
                </Badge>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredServices.map((service) => (
                  <Card 
                    key={service.id} 
                    className={cn(
                      "cursor-pointer transition-colors border-border",
                      selectedServices.includes(service.id) 
                        ? "bg-primary/5 border-primary" 
                        : "hover:bg-muted/50"
                    )}
                    onClick={() => handleServiceToggle(service.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={cn(
                            "w-5 h-5 rounded border-2 flex items-center justify-center",
                            selectedServices.includes(service.id)
                              ? "bg-primary border-primary text-primary-foreground"
                              : "border-muted-foreground"
                          )}>
                            {selectedServices.includes(service.id) && (
                              <CheckCircle2 className="h-3 w-3" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{service.folio}</p>
                            <p className="text-sm text-muted-foreground">{service.service_type_name}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary">${service.service_value.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(service.service_date).toLocaleDateString('es-ES')}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredServices.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No hay servicios disponibles para el período seleccionado</p>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-foreground">Confirmar Cierre</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-muted/50 border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <User className="h-4 w-4 text-primary" />
                      <span className="font-medium text-foreground">Cliente</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {clients.find(c => c.id === formData.client_id)?.name}
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-muted/50 border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <CalendarIcon className="h-4 w-4 text-primary" />
                      <span className="font-medium text-foreground">Período</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {startDate && endDate && 
                        `${format(startDate, "dd/MM/yyyy")} - ${format(endDate, "dd/MM/yyyy")}`
                      }
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-muted/50 border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <FileText className="h-4 w-4 text-primary" />
                      <span className="font-medium text-foreground">Servicios</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {selectedServices.length} servicios seleccionados
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-muted/50 border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <DollarSign className="h-4 w-4 text-primary" />
                      <span className="font-medium text-foreground">Total</span>
                    </div>
                    <p className="text-lg font-bold text-primary">
                      ${totalValue.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Comisión: ${totalCommission.toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observations">Observaciones</Label>
                <Textarea
                  id="observations"
                  placeholder="Comentarios adicionales sobre este cierre..."
                  value={formData.observations || ''}
                  onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                  className="bg-background border-input"
                />
              </div>
            </div>
          )}
        </CardContent>

        <div className="p-6 border-t border-border flex justify-between">
          <div className="flex space-x-2">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                Anterior
              </Button>
            )}
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            {step < 3 ? (
              <Button 
                onClick={handleNext}
                disabled={
                  (step === 1 && (!formData.client_id || !startDate || !endDate)) ||
                  (step === 2 && selectedServices.length === 0)
                }
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Siguiente
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Crear Cierre
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
