
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  X, 
  Calendar as CalendarIcon, 
  RefreshCw,
  Truck,
  User,
  MapPin,
  FileText,
  DollarSign
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import type { CreateServiceData } from '@/types/services';

const serviceSchema = z.object({
  folio: z.string().optional(),
  client_id: z.string().min(1, 'Debe seleccionar un cliente'),
  service_type_id: z.string().min(1, 'Debe seleccionar un tipo de servicio'),
  crane_id: z.string().min(1, 'Debe seleccionar una grúa'),
  operator_id: z.string().min(1, 'Debe seleccionar un operador'),
  request_date: z.string().min(1, 'La fecha de solicitud es requerida'),
  service_date: z.string().min(1, 'La fecha de servicio es requerida'),
  pickup_location: z.string().min(1, 'La dirección de origen es requerida'),
  delivery_location: z.string().min(1, 'La dirección de destino es requerida'),
  vehicle_brand: z.string().optional(),
  vehicle_model: z.string().optional(),
  license_plate: z.string().optional(),
  purchase_order: z.string().optional(),
  service_value: z.number().min(0, 'El valor debe ser mayor o igual a 0'),
  operator_commission: z.number().min(0, 'La comisión debe ser mayor o igual a 0'),
  status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']),
  observations: z.string().optional(),
});

interface CreateServiceFormProps {
  onClose: () => void;
  onSubmit: (data: CreateServiceData) => void;
}

export default function CreateServiceForm({ onClose, onSubmit }: CreateServiceFormProps) {
  const [isManualFolio, setIsManualFolio] = useState(false);
  const [requestDate, setRequestDate] = useState<Date | undefined>(new Date());
  const [serviceDate, setServiceDate] = useState<Date | undefined>(new Date());

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<CreateServiceData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      folio: generateAutoFolio(),
      request_date: format(new Date(), 'yyyy-MM-dd'),
      service_date: format(new Date(), 'yyyy-MM-dd'),
      service_value: 0,
      operator_commission: 0,
      status: 'pending',
    }
  });

  // Mock data
  const clients = [
    { id: '1', name: 'Constructora ABC' },
    { id: '2', name: 'Empresa XYZ' },
    { id: '3', name: 'Transportes Norte' }
  ];

  const serviceTypes = [
    { id: '1', name: 'Montaje Industrial' },
    { id: '2', name: 'Rescate Vehicular' },
    { id: '3', name: 'Traslado de Equipo' }
  ];

  const cranes = [
    { id: '1', name: 'Grúa Liebherr LTM 1050' },
    { id: '2', name: 'Grúa Tadano GT-550E' },
    { id: '3', name: 'Grúa Grove GMK5250L' }
  ];

  const operators = [
    { id: '1', name: 'Juan Pérez' },
    { id: '2', name: 'María González' },
    { id: '3', name: 'Carlos Martínez' }
  ];

  const statusOptions = [
    { value: 'pending', label: 'Pendiente' },
    { value: 'in_progress', label: 'En Progreso' },
    { value: 'completed', label: 'Completado' },
    { value: 'cancelled', label: 'Cancelado' }
  ];

  function generateAutoFolio(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 9000) + 1000;
    return `SRV-${year}${month}${day}-${random}`;
  }

  const handleFolioModeChange = (manual: boolean) => {
    setIsManualFolio(manual);
    if (!manual) {
      setValue('folio', generateAutoFolio());
    }
  };

  const regenerateFolio = () => {
    setValue('folio', generateAutoFolio());
  };

  const handleRequestDateSelect = (date: Date | undefined) => {
    if (date) {
      setRequestDate(date);
      setValue('request_date', format(date, 'yyyy-MM-dd'));
    }
  };

  const handleServiceDateSelect = (date: Date | undefined) => {
    if (date) {
      setServiceDate(date);
      setValue('service_date', format(date, 'yyyy-MM-dd'));
    }
  };

  const onFormSubmit = (data: CreateServiceData) => {
    onSubmit(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-card border-green-dark/20">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Truck className="h-6 w-6 text-green-medium" />
            Nuevo Servicio
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
            {/* Folio del Servicio */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Folio del Servicio</h3>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="manual-folio" className="text-sm">Manual</Label>
                  <Switch
                    id="manual-folio"
                    checked={isManualFolio}
                    onCheckedChange={handleFolioModeChange}
                    className="data-[state=checked]:bg-green-medium"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="flex-1">
                  <Input
                    {...register('folio')}
                    disabled={!isManualFolio}
                    className="border-green-dark/20 focus:border-green-medium"
                    placeholder="SRV-3390"
                  />
                </div>
                {!isManualFolio && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={regenerateFolio}
                    className="border-green-dark/20"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {!isManualFolio && (
                <p className="text-sm text-muted-foreground">
                  El folio se genera automáticamente usando el formato configurado de la empresa.
                </p>
              )}
            </div>

            {/* Fechas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-foreground font-medium">Fecha de Solicitud</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal border-green-dark/20",
                        !requestDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {requestDate ? format(requestDate, "dd 'de' MMMM 'de' yyyy", { locale: es }) : "Seleccionar fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={requestDate}
                      onSelect={handleRequestDateSelect}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                {errors.request_date && <p className="text-sm text-red-500">{errors.request_date.message}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-foreground font-medium">Fecha de Servicio</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal border-green-dark/20",
                        !serviceDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {serviceDate ? format(serviceDate, "dd 'de' MMMM 'de' yyyy", { locale: es }) : "Seleccionar fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={serviceDate}
                      onSelect={handleServiceDateSelect}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                {errors.service_date && <p className="text-sm text-red-500">{errors.service_date.message}</p>}
              </div>
            </div>

            {/* Cliente y Orden de Compra */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-foreground font-medium">Cliente</Label>
                <Select onValueChange={(value) => setValue('client_id', value)}>
                  <SelectTrigger className="border-green-dark/20 focus:border-green-medium">
                    <SelectValue placeholder="Seleccionar cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.client_id && <p className="text-sm text-red-500">{errors.client_id.message}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-foreground font-medium">Orden de Compra (Opcional)</Label>
                <Input
                  {...register('purchase_order')}
                  className="border-green-dark/20 focus:border-green-medium"
                  placeholder="Ej: OC-12345"
                />
              </div>
            </div>

            {/* Tipo de Servicio */}
            <div className="space-y-2">
              <Label className="text-foreground font-medium">Tipo de Servicio</Label>
              <Select onValueChange={(value) => setValue('service_type_id', value)}>
                <SelectTrigger className="border-green-dark/20 focus:border-green-medium">
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  {serviceTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.service_type_id && <p className="text-sm text-red-500">{errors.service_type_id.message}</p>}
            </div>

            {/* Información del Vehículo */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Truck className="h-5 w-5 text-green-medium" />
                Información del Vehículo
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-foreground font-medium">Marca del Vehículo</Label>
                  <Input
                    {...register('vehicle_brand')}
                    className="border-green-dark/20 focus:border-green-medium"
                    placeholder="Ej: Volvo"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground font-medium">Modelo del Vehículo</Label>
                  <Input
                    {...register('vehicle_model')}
                    className="border-green-dark/20 focus:border-green-medium"
                    placeholder="Ej: FH16"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground font-medium">Patente</Label>
                  <Input
                    {...register('license_plate')}
                    className="border-green-dark/20 focus:border-green-medium"
                    placeholder="Ej: AB-CD-12"
                  />
                </div>
              </div>
            </div>

            {/* Ubicaciones */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <MapPin className="h-5 w-5 text-green-medium" />
                Ubicaciones
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-foreground font-medium">Origen</Label>
                  <Textarea
                    {...register('pickup_location')}
                    className="border-green-dark/20 focus:border-green-medium resize-none"
                    placeholder="Dirección de origen del servicio"
                    rows={3}
                  />
                  {errors.pickup_location && <p className="text-sm text-red-500">{errors.pickup_location.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground font-medium">Destino</Label>
                  <Textarea
                    {...register('delivery_location')}
                    className="border-green-dark/20 focus:border-green-medium resize-none"
                    placeholder="Dirección de destino del servicio"
                    rows={3}
                  />
                  {errors.delivery_location && <p className="text-sm text-red-500">{errors.delivery_location.message}</p>}
                </div>
              </div>
            </div>

            {/* Grúa y Operador */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-foreground font-medium">Grúa</Label>
                <Select onValueChange={(value) => setValue('crane_id', value)}>
                  <SelectTrigger className="border-green-dark/20 focus:border-green-medium">
                    <SelectValue placeholder="Seleccionar grúa" />
                  </SelectTrigger>
                  <SelectContent>
                    {cranes.map((crane) => (
                      <SelectItem key={crane.id} value={crane.id}>
                        {crane.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.crane_id && <p className="text-sm text-red-500">{errors.crane_id.message}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-foreground font-medium">Operador</Label>
                <Select onValueChange={(value) => setValue('operator_id', value)}>
                  <SelectTrigger className="border-green-dark/20 focus:border-green-medium">
                    <SelectValue placeholder="Seleccionar operador" />
                  </SelectTrigger>
                  <SelectContent>
                    {operators.map((operator) => (
                      <SelectItem key={operator.id} value={operator.id}>
                        {operator.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.operator_id && <p className="text-sm text-red-500">{errors.operator_id.message}</p>}
              </div>
            </div>

            {/* Valores */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-medium" />
                Valores
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-foreground font-medium">Valor del Servicio (CLP)</Label>
                  <Input
                    type="number"
                    {...register('service_value', { valueAsNumber: true })}
                    className="border-green-dark/20 focus:border-green-medium"
                    placeholder="0"
                  />
                  {errors.service_value && <p className="text-sm text-red-500">{errors.service_value.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground font-medium">Comisión Operador (CLP)</Label>
                  <Input
                    type="number"
                    {...register('operator_commission', { valueAsNumber: true })}
                    className="border-green-dark/20 focus:border-green-medium"
                    placeholder="0"
                  />
                  {errors.operator_commission && <p className="text-sm text-red-500">{errors.operator_commission.message}</p>}
                </div>
              </div>
            </div>

            {/* Estado */}
            <div className="space-y-2">
              <Label className="text-foreground font-medium">Estado</Label>
              <Select onValueChange={(value) => setValue('status', value as any)} defaultValue="pending">
                <SelectTrigger className="border-green-dark/20 focus:border-green-medium">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Observaciones */}
            <div className="space-y-2">
              <Label className="text-foreground font-medium">Observaciones</Label>
              <Textarea
                {...register('observations')}
                className="border-green-dark/20 focus:border-green-medium resize-none"
                placeholder="Observaciones adicionales sobre el servicio..."
                rows={4}
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-green-dark/20">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border-green-dark/20 text-foreground hover:bg-green-light/10"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-green hover:bg-gradient-green-hover text-white"
              >
                {isSubmitting ? 'Creando...' : 'Crear Servicio'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
