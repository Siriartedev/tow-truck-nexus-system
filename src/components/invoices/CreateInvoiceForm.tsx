
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
  FileText,
  DollarSign,
  Calculator,
  User
} from 'lucide-react';
import type { CreateInvoiceData } from '@/types/invoices';
import type { Closure } from '@/types/closures';

interface CreateInvoiceFormProps {
  onClose: () => void;
  onSubmit: (data: CreateInvoiceData) => void;
}

export default function CreateInvoiceForm({ onClose, onSubmit }: CreateInvoiceFormProps) {
  const [formData, setFormData] = useState<Partial<CreateInvoiceData>>({
    tax_rate: 16
  });
  const [issueDate, setIssueDate] = useState<Date>(new Date());
  const [dueDate, setDueDate] = useState<Date>();

  // Mock closures data (only closed closures can be invoiced)
  const availableClosures: Closure[] = [
    {
      id: '1',
      folio: 'CIE-20241220-001',
      client_id: '1',
      client_name: 'Constructora ABC',
      start_date: '2024-12-01',
      end_date: '2024-12-15',
      services_count: 5,
      total_value: 750000,
      total_commission: 75000,
      status: 'closed',
      created_at: '2024-12-16T10:00:00Z',
      updated_at: '2024-12-16T10:00:00Z',
      services: ['1', '2', '3', '4', '5']
    },
    {
      id: '3',
      folio: 'CIE-20241215-003',
      client_id: '3',
      client_name: 'Transportes Norte',
      start_date: '2024-12-01',
      end_date: '2024-12-14',
      services_count: 8,
      total_value: 1200000,
      total_commission: 120000,
      status: 'closed',
      created_at: '2024-12-15T09:15:00Z',
      updated_at: '2024-12-15T09:15:00Z',
      services: ['9', '10', '11', '12', '13', '14', '15', '16']
    }
  ];

  const selectedClosure = availableClosures.find(c => c.id === formData.closure_id);
  const subtotal = selectedClosure?.total_value || 0;
  const taxRate = formData.tax_rate || 0;
  const taxAmount = (subtotal * taxRate) / 100;
  const totalAmount = subtotal + taxAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.closure_id || !issueDate || !dueDate) return;

    const submitData: CreateInvoiceData = {
      closure_id: formData.closure_id,
      issue_date: format(issueDate, 'yyyy-MM-dd'),
      due_date: format(dueDate, 'yyyy-MM-dd'),
      tax_rate: formData.tax_rate || 16,
      observations: formData.observations
    };

    onSubmit(submitData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-xl text-foreground">Nueva Factura</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Crear factura a partir de un cierre
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Closure Selection */}
            <div className="space-y-2">
              <Label htmlFor="closure">Cierre a Facturar *</Label>
              <select
                id="closure"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={formData.closure_id || ''}
                onChange={(e) => setFormData({ ...formData, closure_id: e.target.value })}
                required
              >
                <option value="">Seleccionar cierre</option>
                {availableClosures.map(closure => (
                  <option key={closure.id} value={closure.id}>
                    {closure.folio} - {closure.client_name} (${closure.total_value.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>

            {/* Closure Details */}
            {selectedClosure && (
              <Card className="bg-muted/50 border-border">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Cliente</p>
                        <p className="text-sm text-muted-foreground">{selectedClosure.client_name}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Servicios</p>
                        <p className="text-sm text-muted-foreground">{selectedClosure.services_count} servicios</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CalendarIcon className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Período</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(selectedClosure.start_date).toLocaleDateString('es-ES')} - {new Date(selectedClosure.end_date).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Valor Cierre</p>
                        <p className="text-sm text-muted-foreground">${selectedClosure.total_value.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Fecha de Emisión *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !issueDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {issueDate ? format(issueDate, "PPP", { locale: es }) : "Seleccionar fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={issueDate}
                      onSelect={setIssueDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Fecha de Vencimiento *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dueDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dueDate ? format(dueDate, "PPP", { locale: es }) : "Seleccionar fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dueDate}
                      onSelect={setDueDate}
                      initialFocus
                      disabled={(date) => issueDate ? date < issueDate : false}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Tax Rate */}
            <div className="space-y-2">
              <Label htmlFor="taxRate">Tasa de IVA (%)</Label>
              <Input
                id="taxRate"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={formData.tax_rate || ''}
                onChange={(e) => setFormData({ ...formData, tax_rate: parseFloat(e.target.value) || 0 })}
                className="bg-background border-input"
              />
            </div>

            {/* Calculations */}
            {selectedClosure && (
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Calculator className="h-4 w-4 text-primary" />
                    <span className="font-medium text-foreground">Cálculos</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal:</span>
                      <span className="font-medium text-foreground">${subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">IVA ({taxRate}%):</span>
                      <span className="font-medium text-foreground">${taxAmount.toLocaleString()}</span>
                    </div>
                    <div className="border-t border-border pt-2 flex justify-between">
                      <span className="font-bold text-foreground">Total:</span>
                      <span className="font-bold text-primary text-lg">${totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Observations */}
            <div className="space-y-2">
              <Label htmlFor="observations">Observaciones</Label>
              <Textarea
                id="observations"
                placeholder="Comentarios adicionales para la factura..."
                value={formData.observations || ''}
                onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                className="bg-background border-input"
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-2 pt-4 border-t border-border">
              <Button variant="outline" type="button" onClick={onClose}>
                Cancelar
              </Button>
              <Button 
                type="submit"
                disabled={!formData.closure_id || !issueDate || !dueDate}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Crear Factura
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
