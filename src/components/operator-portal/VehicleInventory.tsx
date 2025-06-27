
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckSquare, Square, User } from 'lucide-react';
import { ServiceInspection, InspectionItem } from '@/types/operator-portal';

interface VehicleInventoryProps {
  inspection: ServiceInspection;
  onUpdate: (inspection: ServiceInspection) => void;
}

export default function VehicleInventory({ inspection, onUpdate }: VehicleInventoryProps) {
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
    exterior: 'Exterior del Vehículo',
    interior: 'Interior del Vehículo', 
    engine: 'Motor y Mecánica',
    safety: 'Elementos de Seguridad',
    documentation: 'Documentación'
  };

  const checkedCount = inspection.inspection_items.filter(item => item.checked).length;
  const totalCount = inspection.inspection_items.length;

  return (
    <div className="space-y-6">
      {/* Controls */}
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

      {/* Inventory Items by Category */}
      {Object.entries(groupedItems).map(([category, items]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="text-lg">
              {categoryNames[category as keyof typeof categoryNames]}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent">
                  <Checkbox
                    id={item.id}
                    checked={item.checked}
                    onCheckedChange={(checked) => handleItemToggle(item.id, checked as boolean)}
                  />
                  <Label
                    htmlFor={item.id}
                    className={`text-sm cursor-pointer flex-1 ${
                      item.checked ? 'line-through text-muted-foreground' : ''
                    }`}
                  >
                    {item.name}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

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
    </div>
  );
}
