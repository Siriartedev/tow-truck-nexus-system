
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ArrowLeft, Save } from 'lucide-react';
import type { CreateServiceTypeData } from '@/types/service-types';

const createServiceTypeSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100, 'Máximo 100 caracteres'),
  description: z.string().min(1, 'La descripción es requerida').max(500, 'Máximo 500 caracteres'),
  base_price: z.number().min(0, 'El precio debe ser mayor a 0'),
  is_active: z.boolean(),
  requires_vehicle_info: z.boolean(),
  required_fields: z.object({
    order_number: z.boolean(),
    origin: z.boolean(),
    destination: z.boolean(),
    crane: z.boolean(),
    operator: z.boolean(),
    vehicle_info: z.object({
      make: z.boolean(),
      model: z.boolean(),
      license_plate: z.boolean(),
    }),
  }),
});

interface CreateServiceTypeFormProps {
  onBack: () => void;
  onSave: (data: CreateServiceTypeData) => void;
}

export default function CreateServiceTypeForm({ onBack, onSave }: CreateServiceTypeFormProps) {
  const form = useForm<CreateServiceTypeData>({
    resolver: zodResolver(createServiceTypeSchema),
    defaultValues: {
      name: '',
      description: '',
      base_price: 0,
      is_active: true,
      requires_vehicle_info: false,
      required_fields: {
        order_number: false,
        origin: true,
        destination: true,
        crane: true,
        operator: true,
        vehicle_info: {
          make: false,
          model: false,
          license_plate: false,
        },
      },
    },
  });

  const onSubmit = (data: CreateServiceTypeData) => {
    onSave(data);
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={onBack} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <div>
          <h1 className="text-4xl font-bold text-foreground">Crear Tipo de Servicio</h1>
          <p className="text-muted-foreground">Configure un nuevo tipo de servicio</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Información Básica */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-foreground">Información Básica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Montaje Industrial" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe el tipo de servicio..."
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="base_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio Base (CLP) *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="150000"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between p-4 border border-border/30 rounded-lg bg-background/50">
                      <div>
                        <FormLabel className="text-base font-medium">Tipo de servicio activo</FormLabel>
                        <p className="text-sm text-muted-foreground">El servicio estará disponible para selección</p>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="requires_vehicle_info"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between p-4 border border-border/30 rounded-lg bg-background/50">
                      <div>
                        <FormLabel className="text-base font-medium">Información de vehículo opcional</FormLabel>
                        <p className="text-sm text-muted-foreground">Permitir capturar datos del vehículo</p>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Configuración de Campos Requeridos */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-foreground">Configuración de Campos Requeridos</CardTitle>
              <p className="text-sm text-muted-foreground">
                Selecciona qué campos serán obligatorios en el formulario de servicios
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="required_fields.order_number"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-3 p-3 border border-border/30 rounded-lg bg-background/30">
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="text-sm font-medium cursor-pointer">Orden de Compra</FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="required_fields.origin"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-3 p-3 border border-border/30 rounded-lg bg-background/30">
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="text-sm font-medium cursor-pointer">Origen</FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="required_fields.destination"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-3 p-3 border border-border/30 rounded-lg bg-background/30">
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="text-sm font-medium cursor-pointer">Destino</FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="required_fields.crane"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-3 p-3 border border-border/30 rounded-lg bg-background/30">
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="text-sm font-medium cursor-pointer">Grúa</FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="required_fields.operator"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-3 p-3 border border-border/30 rounded-lg bg-background/30">
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="text-sm font-medium cursor-pointer">Operador</FormLabel>
                    </FormItem>
                  )}
                />
              </div>

              {/* Información del Vehículo */}
              <div className="border-t border-border/30 pt-6">
                <Label className="text-base font-medium text-foreground mb-4 block">
                  Información del Vehículo
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="required_fields.vehicle_info.make"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-3 p-3 border border-border/30 rounded-lg bg-background/30">
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="text-sm font-medium cursor-pointer">Marca</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="required_fields.vehicle_info.model"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-3 p-3 border border-border/30 rounded-lg bg-background/30">
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="text-sm font-medium cursor-pointer">Modelo</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="required_fields.vehicle_info.license_plate"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-3 p-3 border border-border/30 rounded-lg bg-background/30">
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="text-sm font-medium cursor-pointer">Patente</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botones de Acción */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onBack}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-gradient-green hover:bg-gradient-green-hover">
              <Save className="h-4 w-4 mr-2" />
              Guardar Tipo de Servicio
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
