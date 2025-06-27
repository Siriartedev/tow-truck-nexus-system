
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowRight, ArrowLeft, X } from 'lucide-react';
import { ServiceInspection } from '@/types/operator-portal';
import InventoryProgress from './inventory/InventoryProgress';
import ClientInfo from './inventory/ClientInfo';

interface VehicleInventoryProps {
  inspection: ServiceInspection;
  onUpdate: (inspection: ServiceInspection) => void;
  onNext: () => void;
  onPrevious?: () => void;
}

export default function VehicleInventory({ inspection, onUpdate, onNext, onPrevious }: VehicleInventoryProps) {
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

  const handleItemToggle = (itemId: string, checked: boolean | "indeterminate") => {
    const isChecked = checked === true;
    const updatedItems = inspection.inspection_items.map(item =>
      item.id === itemId ? { ...item, checked: isChecked } : item
    );

    onUpdate({
      ...inspection,
      inspection_items: updatedItems
    });

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

  return (
    <div className="space-y-6">
      <InventoryProgress 
        inspection={inspection}
        allChecked={allChecked}
        onToggleAll={handleToggleAll}
      />

      <Card>
        <CardHeader>
          <CardTitle>Elementos de Inspección</CardTitle>
          <p className="text-sm text-muted-foreground">
            Selecciona los elementos que están presentes en el vehículo. Puedes eliminar elementos que no aplican.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inspection.inspection_items.map((item) => (
              <div 
                key={item.id} 
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3 flex-1">
                  <Checkbox
                    id={item.id}
                    checked={item.checked}
                    onCheckedChange={(checked) => handleItemToggle(item.id, checked)}
                    className="h-4 w-4"
                  />
                  <Label
                    htmlFor={item.id}
                    className={`text-sm cursor-pointer select-none flex-1 ${
                      item.checked ? 'font-medium text-green-800' : 'text-gray-700'
                    }`}
                  >
                    {item.name}
                  </Label>
                </div>
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1"
                  type="button"
                  title="Eliminar elemento"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <ClientInfo 
        clientName={inspection.client_present_name || ''}
        onClientNameChange={(name) => onUpdate({ ...inspection, client_present_name: name })}
      />

      <Card>
        <CardHeader>
          <CardTitle>Observaciones del Vehículo</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Describe el estado general del vehículo, daños visibles, condiciones especiales, etc."
            value={inspection.observations}
            onChange={(e) => onUpdate({ ...inspection, observations: e.target.value })}
            rows={4}
          />
        </CardContent>
      </Card>

      <div className="flex justify-between items-center pt-6">
        {onPrevious ? (
          <Button onClick={onPrevious} variant="outline" size="lg" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Anterior</span>
          </Button>
        ) : (
          <div></div>
        )}
        
        <Button onClick={onNext} size="lg" className="flex items-center space-x-2 bg-green-600 hover:bg-green-700">
          <span>Continuar a Fotografías</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
