
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Building, X } from 'lucide-react';

const clientSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(8, 'El teléfono debe tener al menos 8 caracteres'),
  address: z.string().min(5, 'La dirección debe tener al menos 5 caracteres'),
  rfc: z.string().min(12, 'El RFC debe tener al menos 12 caracteres'),
  contact_person: z.string().min(2, 'El nombre de contacto debe tener al menos 2 caracteres'),
  is_active: z.boolean(),
});

type ClientFormData = z.infer<typeof clientSchema>;

interface CreateClientFormProps {
  onClose: () => void;
  onSubmit?: (data: ClientFormData) => void;
}

export default function CreateClientForm({ onClose, onSubmit }: CreateClientFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      is_active: true,
    },
  });

  const isActive = watch('is_active');

  const handleFormSubmit = async (data: ClientFormData) => {
    setIsSubmitting(true);
    
    try {
      console.log('Creating client:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Cliente creado",
        description: "El cliente ha sido creado exitosamente.",
      });
      
      if (onSubmit) {
        onSubmit(data);
      }
      
      onClose();
    } catch (error) {
      console.error('Error creating client:', error);
      toast({
        title: "Error",
        description: "Hubo un error al crear el cliente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card/95 backdrop-blur-sm border-green-dark/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
          <div className="flex items-center space-x-2">
            <Building className="h-6 w-6 text-green-medium" />
            <CardTitle className="text-2xl text-gradient-green">Nuevo Cliente</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* Información Básica */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-medium">Información Básica</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre de la Empresa *</Label>
                  <Input
                    id="name"
                    {...register('name')}
                    placeholder="Ej: Constructora ABC"
                    className="border-green-dark/20 focus:border-green-medium"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_person">Persona de Contacto *</Label>
                  <Input
                    id="contact_person"
                    {...register('contact_person')}
                    placeholder="Ej: Juan Martínez"
                    className="border-green-dark/20 focus:border-green-medium"
                  />
                  {errors.contact_person && (
                    <p className="text-sm text-red-500">{errors.contact_person.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    placeholder="contacto@empresa.com"
                    className="border-green-dark/20 focus:border-green-medium"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono *</Label>
                  <Input
                    id="phone"
                    {...register('phone')}
                    placeholder="+52 81 1234-5678"
                    className="border-green-dark/20 focus:border-green-medium"
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-500">{errors.phone.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rfc">RFC *</Label>
                  <Input
                    id="rfc"
                    {...register('rfc')}
                    placeholder="CABC123456789"
                    className="border-green-dark/20 focus:border-green-medium"
                  />
                  {errors.rfc && (
                    <p className="text-sm text-red-500">{errors.rfc.message}</p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Dirección *</Label>
                  <Input
                    id="address"
                    {...register('address')}
                    placeholder="Av. Industrial 123, Monterrey, NL"
                    className="border-green-dark/20 focus:border-green-medium"
                  />
                  {errors.address && (
                    <p className="text-sm text-red-500">{errors.address.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Estado */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-medium">Estado</h3>
              
              <div className="flex items-center justify-between p-4 rounded-lg bg-accent/50 border border-green-dark/20">
                <div>
                  <Label htmlFor="is_active" className="text-base font-medium">
                    Cliente Activo
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Determina si el cliente puede recibir nuevos servicios
                  </p>
                </div>
                <Switch
                  id="is_active"
                  checked={isActive}
                  onCheckedChange={(checked) => setValue('is_active', checked)}
                  className="data-[state=checked]:bg-green-medium"
                />
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 border-green-dark/20 text-foreground hover:bg-green-light/10"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-green hover:bg-gradient-green-hover"
              >
                {isSubmitting ? 'Creando...' : 'Crear Cliente'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
