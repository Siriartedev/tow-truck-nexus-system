
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { CreateCostData } from '@/types/costs';

const costSchema = z.object({
  date: z.string().min(1, 'La fecha es requerida'),
  amount: z.number().min(0.01, 'El monto debe ser mayor a 0'),
  description: z.string().min(1, 'La descripción es requerida'),
  category: z.string().min(1, 'La categoría es requerida'),
  crane_id: z.string().optional(),
  operator_id: z.string().optional(),
  service_id: z.string().optional(),
  service_folio: z.string().optional(),
  notes: z.string().optional(),
});

interface CreateCostFormProps {
  onClose: () => void;
  onSubmit: (data: CreateCostData) => void;
}

export default function CreateCostForm({ onClose, onSubmit }: CreateCostFormProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<CreateCostData>({
    resolver: zodResolver(costSchema),
    defaultValues: {
      date: format(new Date(), 'yyyy-MM-dd'),
      amount: 0,
      description: '',
      category: '',
      crane_id: '',
      operator_id: '',
      service_id: '',
      service_folio: '',
      notes: '',
    }
  });

  // Mock data for dropdowns
  const categories = [
    { id: 'combustible', name: 'Combustible' },
    { id: 'mantenimiento', name: 'Mantenimiento' },
    { id: 'reparacion', name: 'Reparación' },
    { id: 'seguros', name: 'Seguros' },
    { id: 'licencias', name: 'Licencias' },
    { id: 'otros', name: 'Otros' }
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

  const services = [
    { id: '1', name: 'Montaje de estructura' },
    { id: '2', name: 'Traslado de equipo' },
    { id: '3', name: 'Mantenimiento industrial' }
  ];

  const onFormSubmit = (data: CreateCostData) => {
    // Clean up "none" values before submitting
    const cleanData = {
      ...data,
      crane_id: data.crane_id === 'none' ? undefined : data.crane_id,
      operator_id: data.operator_id === 'none' ? undefined : data.operator_id,
      service_id: data.service_id === 'none' ? undefined : data.service_id,
    };
    onSubmit(cleanData);
    onClose();
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setValue('date', format(date, 'yyyy-MM-dd'));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-green-dark/20">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-xl font-bold text-foreground">Nuevo Costo</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            {/* Date and Amount */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-foreground font-medium">Fecha</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal border-green-dark/20",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "dd/MM/yyyy", { locale: es }) : "Seleccionar fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                {errors.date && <p className="text-sm text-red-500">{errors.date.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount" className="text-foreground font-medium">Monto</Label>
                <Input
                  type="number"
                  step="0.01"
                  {...register('amount', { valueAsNumber: true })}
                  className="border-green-dark/20 focus:border-green-medium"
                  placeholder="0.00"
                />
                {errors.amount && <p className="text-sm text-red-500">{errors.amount.message}</p>}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-foreground font-medium">Descripción</Label>
              <Textarea
                {...register('description')}
                className="border-green-dark/20 focus:border-green-medium min-h-[80px] resize-none"
                placeholder="Descripción del costo..."
              />
              {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-foreground font-medium">Categoría</Label>
              <Select onValueChange={(value) => setValue('category', value)}>
                <SelectTrigger className="border-green-dark/20 focus:border-green-medium">
                  <SelectValue placeholder="Seleccione una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-sm text-red-500">{errors.category.message}</p>}
            </div>

            {/* Optional Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="crane_id" className="text-foreground font-medium">Grúa (Opcional)</Label>
                <Select onValueChange={(value) => setValue('crane_id', value === 'none' ? undefined : value)}>
                  <SelectTrigger className="border-green-dark/20 focus:border-green-medium">
                    <SelectValue placeholder="Sin asociar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sin asociar</SelectItem>
                    {cranes.map((crane) => (
                      <SelectItem key={crane.id} value={crane.id}>
                        {crane.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="operator_id" className="text-foreground font-medium">Operador (Opcional)</Label>
                <Select onValueChange={(value) => setValue('operator_id', value === 'none' ? undefined : value)}>
                  <SelectTrigger className="border-green-dark/20 focus:border-green-medium">
                    <SelectValue placeholder="Sin asociar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sin asociar</SelectItem>
                    {operators.map((operator) => (
                      <SelectItem key={operator.id} value={operator.id}>
                        {operator.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="service_id" className="text-foreground font-medium">Servicio (Opcional)</Label>
                <Select onValueChange={(value) => setValue('service_id', value === 'none' ? undefined : value)}>
                  <SelectTrigger className="border-green-dark/20 focus:border-green-medium">
                    <SelectValue placeholder="Sin asociar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sin asociar</SelectItem>
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="service_folio" className="text-foreground font-medium">Folio de Servicio (Opcional)</Label>
                <Input
                  {...register('service_folio')}
                  className="border-green-dark/20 focus:border-green-medium"
                  placeholder="Ej: F-1234"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-foreground font-medium">Notas (Opcional)</Label>
              <Textarea
                {...register('notes')}
                className="border-green-dark/20 focus:border-green-medium min-h-[100px] resize-none"
                placeholder="Notas adicionales..."
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-green-dark/20">
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
                {isSubmitting ? 'Guardando...' : 'Guardar Costo'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
