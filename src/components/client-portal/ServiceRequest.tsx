
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { 
  ChevronLeft,
  ChevronRight,
  Check,
  Truck,
  MapPin,
  FileText,
  Mail
} from 'lucide-react';
import type { ServiceRequestData } from '@/types/client-portal';

const steps = [
  { id: 1, title: 'Tipo de Servicio', icon: Truck },
  { id: 2, title: 'Información del Vehículo', icon: Truck },
  { id: 3, title: 'Ubicaciones', icon: MapPin },
  { id: 4, title: 'Confirmación', icon: Check }
];

const serviceTypes = [
  { id: '1', name: 'Montaje Industrial' },
  { id: '2', name: 'Rescate Vehicular' },
  { id: '3', name: 'Traslado de Equipo' },
  { id: '4', name: 'Servicio de Emergencia' }
];

export default function ServiceRequest() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<ServiceRequestData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof ServiceRequestData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Solicitud enviada",
      description: "Su solicitud ha sido enviada exitosamente. Recibirá una confirmación por email en breve.",
    });

    // Reset form
    setFormData({});
    setCurrentStep(1);
    setIsSubmitting(false);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="service_type">Tipo de Servicio</Label>
              <Select 
                value={formData.service_type_id} 
                onValueChange={(value) => handleInputChange('service_type_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione el tipo de servicio" />
                </SelectTrigger>
                <SelectContent>
                  {serviceTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="preferred_date">Fecha Preferida</Label>
              <Input
                id="preferred_date"
                type="date"
                value={formData.preferred_date || ''}
                onChange={(e) => handleInputChange('preferred_date', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <Label htmlFor="contact_phone">Teléfono de Contacto</Label>
              <Input
                id="contact_phone"
                type="tel"
                placeholder="Ej: +52 81 1234 5678"
                value={formData.contact_phone || ''}
                onChange={(e) => handleInputChange('contact_phone', e.target.value)}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vehicle_brand">Marca del Vehículo</Label>
                <Input
                  id="vehicle_brand"
                  placeholder="Ej: Volvo, Mercedes, Kenworth"
                  value={formData.vehicle_brand || ''}
                  onChange={(e) => handleInputChange('vehicle_brand', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="vehicle_model">Modelo</Label>
                <Input
                  id="vehicle_model"
                  placeholder="Ej: FH16, Actros, T800"
                  value={formData.vehicle_model || ''}
                  onChange={(e) => handleInputChange('vehicle_model', e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vehicle_year">Año</Label>
                <Input
                  id="vehicle_year"
                  type="number"
                  placeholder="Ej: 2020"
                  min="1990"
                  max={new Date().getFullYear()}
                  value={formData.vehicle_year || ''}
                  onChange={(e) => handleInputChange('vehicle_year', parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="license_plate">Placas</Label>
                <Input
                  id="license_plate"
                  placeholder="Ej: AB-CD-12"
                  value={formData.license_plate || ''}
                  onChange={(e) => handleInputChange('license_plate', e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="pickup_location">Ubicación de Recogida</Label>
              <Textarea
                id="pickup_location"
                placeholder="Dirección completa de recogida..."
                value={formData.pickup_location || ''}
                onChange={(e) => handleInputChange('pickup_location', e.target.value)}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="delivery_location">Ubicación de Entrega</Label>
              <Textarea
                id="delivery_location"
                placeholder="Dirección completa de entrega..."
                value={formData.delivery_location || ''}
                onChange={(e) => handleInputChange('delivery_location', e.target.value)}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="additional_info">Información Adicional</Label>
              <Textarea
                id="additional_info"
                placeholder="Cualquier información adicional relevante para el servicio..."
                value={formData.additional_info || ''}
                onChange={(e) => handleInputChange('additional_info', e.target.value)}
                rows={4}
              />
            </div>
          </div>
        );

      case 4:
        const selectedServiceType = serviceTypes.find(type => type.id === formData.service_type_id);
        return (
          <div className="space-y-6">
            <div className="bg-green-dark/5 border border-green-dark/20 rounded-lg p-6">
              <h3 className="font-semibold text-foreground mb-4">Resumen de la Solicitud</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tipo de Servicio:</span>
                  <span className="font-medium">{selectedServiceType?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fecha Preferida:</span>
                  <span className="font-medium">
                    {formData.preferred_date ? new Date(formData.preferred_date).toLocaleDateString('es-ES') : 'No especificada'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Vehículo:</span>
                  <span className="font-medium">
                    {formData.vehicle_brand} {formData.vehicle_model} {formData.vehicle_year}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Placas:</span>
                  <span className="font-medium">{formData.license_plate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Teléfono:</span>
                  <span className="font-medium">{formData.contact_phone}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-600/5 border border-blue-600/20 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-blue-600">
                <Mail className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Recibirá una confirmación por email una vez enviada la solicitud
                </span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Solicitar Nuevo Servicio</h2>
        <p className="text-muted-foreground mt-1">Complete el formulario paso a paso</p>
      </div>

      {/* Progress Steps */}
      <Card className="bg-card border-border">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isCompleted = step.id < currentStep;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center space-x-2 ${
                    isActive ? 'text-primary' : isCompleted ? 'text-green-medium' : 'text-muted-foreground'
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                      isActive ? 'border-primary bg-primary/10' : 
                      isCompleted ? 'border-green-medium bg-green-medium/10' : 
                      'border-muted-foreground/30'
                    }`}>
                      {isCompleted ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Icon className="h-4 w-4" />
                      )}
                    </div>
                    <span className="font-medium text-sm">{step.title}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 mx-4 ${
                      step.id < currentStep ? 'bg-green-medium' : 'bg-muted-foreground/30'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Form Content */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {React.createElement(steps[currentStep - 1].icon, { className: "h-5 w-5" })}
            <span>{steps[currentStep - 1].title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="border-border"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Anterior
        </Button>

        <div className="text-sm text-muted-foreground">
          Paso {currentStep} de {steps.length}
        </div>

        {currentStep < steps.length ? (
          <Button
            onClick={handleNext}
            className="bg-primary hover:bg-primary/90"
          >
            Siguiente
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-green-medium hover:bg-green-dark"
          >
            {isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
            <FileText className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}
