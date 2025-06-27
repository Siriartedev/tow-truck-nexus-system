
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import type { CreateOperatorData } from '@/types/operators';

const createOperatorSchema = z.object({
  full_name: z.string().min(2, 'El nombre completo debe tener al menos 2 caracteres'),
  rut: z.string().min(9, 'El RUT debe tener formato válido (ej: 12.345.678-9)'),
  phone: z.string().min(8, 'El teléfono debe tener al menos 8 dígitos'),
  license_number: z.string().min(6, 'El número de licencia debe tener al menos 6 caracteres'),
  exam_expiry_date: z.string().min(1, 'La fecha de vencimiento del examen es requerida'),
  is_active: z.boolean(),
});

interface CreateOperatorFormProps {
  onBack: () => void;
  onSave: (data: CreateOperatorData) => void;
}

export default function CreateOperatorForm({ onBack, onSave }: CreateOperatorFormProps) {
  const [autoSave, setAutoSave] = useState(true);

  const form = useForm<CreateOperatorData>({
    resolver: zodResolver(createOperatorSchema),
    defaultValues: {
      full_name: '',
      rut: '',
      phone: '',
      license_number: '',
      exam_expiry_date: '',
      is_active: true,
    },
  });

  const onSubmit = (data: CreateOperatorData) => {
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
          <h1 className="text-4xl font-bold text-foreground mb-2">Nuevo Operador</h1>
          <p className="text-muted-foreground">
            Ingresa los datos del nuevo operador
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Información Básica */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-foreground">Información Personal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Nombre Completo</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ingrese nombre completo" 
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
                  name="rut"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">RUT</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="12.345.678-9" 
                          {...field}
                          className="bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Teléfono</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="+56 9 1234 5678" 
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
                  name="license_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Número de Licencia</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="A-123456" 
                          {...field}
                          className="bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="exam_expiry_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Vencimiento Examen</FormLabel>
                      <FormControl>
                        <Input 
                          type="date"
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
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex flex-col justify-end">
                      <FormLabel className="text-foreground mb-2">Estado</FormLabel>
                      <div className="flex items-center space-x-3">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="data-[state=checked]:bg-green-medium"
                          />
                        </FormControl>
                        <span className="text-sm text-foreground">
                          {field.value ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
                Crear Operador
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
