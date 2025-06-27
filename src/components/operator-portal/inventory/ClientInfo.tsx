
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User } from 'lucide-react';

interface ClientInfoProps {
  clientName: string;
  onClientNameChange: (name: string) => void;
}

export default function ClientInfo({ clientName, onClientNameChange }: ClientInfoProps) {
  return (
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
            value={clientName}
            onChange={(e) => onClientNameChange(e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
