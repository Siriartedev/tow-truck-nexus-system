
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { OperatorAuth } from '@/types/operator-portal';

interface OperatorLoginProps {
  onLogin: (operator: OperatorAuth) => void;
}

// Mock operators - En producción vendría de la API
const mockOperators: OperatorAuth[] = [
  {
    id: '1',
    name: 'Juan Carlos Pérez',
    email: 'juan.perez@empresa.com',
    phone: '+52 55 1234 5678'
  },
  {
    id: '2',
    name: 'María González López',
    email: 'maria.gonzalez@empresa.com',
    phone: '+52 55 2345 6789'
  },
  {
    id: '3',
    name: 'Carlos Rodríguez',
    email: 'carlos.rodriguez@empresa.com',
    phone: '+52 55 3456 7890'
  }
];

export default function OperatorLogin({ onLogin }: OperatorLoginProps) {
  const [selectedOperatorId, setSelectedOperatorId] = useState<string>('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!selectedOperatorId) {
      setError('Por favor selecciona un operador');
      return;
    }

    if (!pin) {
      setError('Por favor ingresa tu PIN');
      return;
    }

    // Mock validation - PIN simple para demostración
    if (pin !== '1234') {
      setError('PIN incorrecto');
      return;
    }

    const operator = mockOperators.find(op => op.id === selectedOperatorId);
    if (operator) {
      onLogin(operator);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Sistema
          </Link>
          <div className="bg-gradient-green p-4 rounded-lg">
            <User className="h-12 w-12 mx-auto text-black mb-2" />
            <h1 className="text-2xl font-bold text-black">Portal del Operador</h1>
            <p className="text-black/80">Inicia sesión para acceder a tus servicios</p>
          </div>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Iniciar Sesión</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="operator">Seleccionar Operador</Label>
              <Select value={selectedOperatorId} onValueChange={setSelectedOperatorId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona tu nombre" />
                </SelectTrigger>
                <SelectContent>
                  {mockOperators.map((operator) => (
                    <SelectItem key={operator.id} value={operator.id}>
                      {operator.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pin">PIN de Acceso</Label>
              <Input
                id="pin"
                type="password"
                placeholder="Ingresa tu PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                maxLength={4}
              />
              <p className="text-xs text-muted-foreground">
                PIN de demostración: 1234
              </p>
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                {error}
              </div>
            )}

            <Button 
              onClick={handleLogin} 
              className="w-full"
              disabled={!selectedOperatorId || !pin}
            >
              Iniciar Sesión
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
