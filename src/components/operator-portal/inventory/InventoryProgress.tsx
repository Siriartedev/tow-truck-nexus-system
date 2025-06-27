
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckSquare, Square } from 'lucide-react';
import { ServiceInspection } from '@/types/operator-portal';

interface InventoryProgressProps {
  inspection: ServiceInspection;
  allChecked: boolean;
  onToggleAll: () => void;
}

export default function InventoryProgress({ inspection, allChecked, onToggleAll }: InventoryProgressProps) {
  const checkedCount = inspection.inspection_items.filter(item => item.checked).length;
  const totalCount = inspection.inspection_items.length;

  return (
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
            onClick={onToggleAll}
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
  );
}
