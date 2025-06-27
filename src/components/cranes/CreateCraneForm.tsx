
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save, Shield } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import type { CreateCraneData } from '@/types/cranes';

const createCraneSchema = z.object({
  license_plate: z.string().min(5, 'La patente debe tener al menos 5 caracteres'),
  type: z.string().min(1, 'Debe seleccionar un tipo de grúa'),
  brand: z.string().min(2, 'La marca debe tener al menos 2 caracteres'),
  model: z.string().min(2, 'El modelo debe tener al menos 2 caracteres'),
  circulation_permit_expiry: z.string().min(1, 'La fecha de vencimiento del permiso de circulación es requerida'),
  insurance_expiry: z.string().min(1, 'La fecha de vencimiento del seguro es requerida'),
  technical_revision_expiry: z.string().min(1, 'La fecha de vencimiento de la revisión técnica es requerida'),
  is_active: z.boolean(),
});

interface CreateCraneFormProps {
  onBack: () => void;
  onSave: (data: CreateCraneData) => void;
}

const craneTypes = [
  { value: 'Liviana', label: 'Liviana' },
  { value: 'Mediana', label: 'Mediana' },
  { value: 'Pesada', label: 'Pesada' },
];

export default function CreateCraneForm({ onBack, onSave }: CreateCraneFormProps) {
  const [autoSave, setAutoSave] = useState(true);

  const form = useForm<CreateCraneData>({
    resolver: zodResolver(createCraneSchema),
    defaultValues: {
      license_plate: '',
      type: '',
      brand: '',
      model: '',
      circulation_permit_expiry: '',
      insurance_expiry: '',
      technical_revision_expiry: '',
      is_active: true,
    },
  });

  const onSubmit = (data: CreateCraneData) => {
    console.log('Form data:', data);
    onSave(data);
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Nueva Grúa</h1>
          <p className="text-muted-foreground">
            Ingresa los datos de la nueva grúa
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Información Básica */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-foreground">Información del Vehículo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="license_plate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Patente *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="GRUA-01" 
                          {...field}
                          className="bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground focus:border-green-medium"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Tipo *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-background/50 border-border/50 text-foreground focus:border-green-medium">
                            <SelectValue placeholder="Liviana" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-background border-border">
                          {craneTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value} className="text-foreground hover:bg-accent">
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Marca *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Mercedes Benz" 
                          {...field}
                          className="bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Modelo *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Atego 1725" 
                          {...field}
                          className="bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Documentación */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-foreground">Documentación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="circulation_permit_expiry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Venc. Permiso Circulación</FormLabel>
                      <FormControl>
                        <Input 
                          type="date"
                          placeholder="27/06/2025"
                          {...field}
                          className="bg-background/50 border-border/50 text-foreground"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="insurance_expiry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Venc. Seguro</FormLabel>
                      <FormControl>
                        <Input 
                          type="date"
                          placeholder="27/06/2025"
                          {...field}
                          className="bg-background/50 border-border/50 text-foreground"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="technical_revision_expiry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Venc. Revisión Técnica</FormLabel>
                      <FormControl>
                        <Input 
                          type="date"
                          placeholder="27/06/2025"
                          {...field}
                          className="bg-background/50 border-border/50 text-foreground"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border/50 p-4 bg-background/20">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base text-foreground">
                        Grúa Activa
                      </FormLabel>
                      <FormDescription className="text-muted-foreground">
                        La grúa estará disponible para asignación a servicios
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-green-medium"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-border/30">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Guardado automático activo</span>
            </div>
            <div className="flex space-x-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onBack}
                className="border-border/50 text-muted-foreground hover:text-foreground"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="bg-gradient-green hover:bg-gradient-green-hover"
              >
                <Save className="h-4 w-4 mr-2" />
                Crear Grúa
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
