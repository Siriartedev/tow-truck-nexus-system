
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckSquare, Square, User, ArrowRight, X } from 'lucide-react';
import { ServiceInspection, InspectionItem } from '@/types/operator-portal';

interface VehicleInventoryProps {
  inspection: ServiceInspection;
  onUpdate: (inspection: ServiceInspection) => void;
  onNext: () => void;
}

export default function VehicleInventory({ inspection, onUpdate, onNext }: VehicleInventoryProps) {
  const [allChecked, setAllChecked] = useState(false);

  const handleToggleAll = () => {
    const newCheckedState = !allChecked;
    setAllChecked(newCheckedState);
    
    const updatedItems = inspection.inspection_items.map(item => ({
      ...item,
      checked: newCheckedState
    }));

    onUpdate({
      ...inspection,
      inspection_items: updatedItems
    });
  };

  const handleItemToggle = (itemId: string, checked: boolean) => {
    const updatedItems = inspection.inspection_items.map(item =>
      item.id === itemId ? { ...item, checked } : item
    );

    onUpdate({
      ...inspection,
      inspection_items: updatedItems
    });

    // Actualizar estado de "todos seleccionados"
    const allItemsChecked = updatedItems.every(item => item.checked);
    setAllChecked(allItemsChecked);
  };

  const handleRemoveItem = (itemId: string) => {
    const updatedItems = inspection.inspection_items.filter(item => item.id !== itemId);
    onUpdate({
      ...inspection,
      inspection_items: updatedItems
    });
  };

  const handleObservationsChange = (observations: string) => {
    onUpdate({
      ...inspection,
      observations
    });
  };

  const handleClientNameChange = (client_present_name: string) => {
    onUpdate({
      ...inspection,
      client_present_name
    });
  };

  const groupedItems = inspection.inspection_items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, InspectionItem[]>);

  const categoryNames = {
    interior: 'Interior del Vehículo',
    motor: 'Motor y Mecánica', 
    exterior: 'Exterior del Vehículo',
    seguridad: 'Elementos de Seguridad',
    herramientas: 'Herramientas',
    otros: 'Otros Elementos'
  };

  const checkedCount = inspection.inspection_items.filter(item => item.checked).length;
  const totalCount = inspection.inspection_items.length;

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <CheckSquare className="h-5 w-5 text-green-600" />
              <span>Inventario del Vehículo</span>
            </CardTitle>
            <div className="text-sm text-muted-foreground">
              {checkedCount} de {totalCount} elementos verificados
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              onClick={handleToggleAll}
              className="flex items-center space-x-2"
            >
              {allChecked ? <Square className="h-4 w-4" /> : <CheckSquare className="h-4 w-4" />}
              <span>{allChecked ? 'Desmarcar Todo' : 'Marcar Todo'}</span>
            </Button>
            
            <div className="text-sm font-medium">
              Progreso: {Math.round((checkedCount / totalCount) * 100)}%
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(checkedCount / totalCount) * 100}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Inventory Items as Chips */}
      <Card>
        <CardHeader>
          <CardTitle>Elementos de Inspección</CardTitle>
          <p className="text-sm text-muted-foreground">
            Selecciona los elementos que están presentes en el vehículo. Puedes eliminar elementos que no aplican con la X.
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {inspection.inspection_items.map((item) => (
              <div 
                key={item.id} 
                className={`
                  flex items-center space-x-2 px-3 py-2 rounded-full border transition-all duration-200
                  ${item.checked 
                    ? 'bg-green-100 border-green-300 text-green-800' 
                    : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <Checkbox
                  id={item.id}
                  checked={item.checked}
                  onCheckedChange={(checked) => handleItemToggle(item.id, checked as boolean)}
                  className="h-4 w-4"
                />
                <Label
                  htmlFor={item.id}
                  className={`text-sm cursor-pointer select-none ${
                    item.checked ? 'font-medium' : ''
                  }`}
                >
                  {item.name}
                </Label>
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors ml-1"
                  type="button"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Client Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Información del Cliente</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="client-name">Nombre del Cliente (si está presente)</Label>
            <Input
              id="client-name"
              placeholder="Nombre completo del cliente presente durante la inspección"
              value={inspection.client_present_name || ''}
              onChange={(e) => handleClientNameChange(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Observations */}
      <Card>
        <CardHeader>
          <CardTitle>Observaciones del Vehículo</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Describe el estado general del vehículo, daños visibles, condiciones especiales, etc."
            value={inspection.observations}
            onChange={(e) => handleObservationsChange(e.target.value)}
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-end pt-6">
        <Button onClick={onNext} size="lg" className="flex items-center space-x-2">
          <span>Continuar a Fotografías</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
