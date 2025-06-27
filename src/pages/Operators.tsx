
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Phone, IdCard, Calendar } from 'lucide-react';
import CreateOperatorForm from '@/components/operators/CreateOperatorForm';
import type { Operator } from '@/types/operators';

export default function Operators() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  // Mock data - en producción vendría de la API
  const operators: Operator[] = [
    {
      id: '1',
      full_name: 'Juan Carlos Pérez González',
      rut: '12.345.678-9',
      phone: '+56 9 1234 5678',
      license_number: 'A-123456',
      exam_expiry_date: '2025-06-27',
      is_active: true,
      created_at: '2024-01-15',
      updated_at: '2024-01-15'
    },
    {
      id: '2',
      full_name: 'María Elena Rodríguez Silva',
      rut: '98.765.432-1',
      phone: '+56 9 8765 4321',
      license_number: 'A-654321',
      exam_expiry_date: '2025-12-15',
      is_active: true,
      created_at: '2024-01-10',
      updated_at: '2024-01-10'
    },
    {
      id: '3',
      full_name: 'Carlos Alberto Mendoza Torres',
      rut: '15.678.943-2',
      phone: '+56 9 5567 8943',
      license_number: 'A-789123',
      exam_expiry_date: '2024-08-20',
      is_active: false,
      created_at: '2023-12-05',
      updated_at: '2024-01-05'
    }
  ];

  if (showCreateForm) {
    return (
      <CreateOperatorForm 
        onBack={() => setShowCreateForm(false)}
        onSave={(data) => {
          console.log('Saving operator:', data);
          setShowCreateForm(false);
        }}
      />
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Operadores</h1>
          <p className="text-muted-foreground">
            Gestiona los operadores de grúas registrados en el sistema
          </p>
        </div>
        <Button 
          onClick={() => setShowCreateForm(true)}
          className="bg-gradient-green hover:bg-gradient-green-hover"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Operador
        </Button>
      </div>

      {/* Operators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {operators.map((operator) => {
          const isExamExpiringSoon = new Date(operator.exam_expiry_date) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
          
          return (
            <Card key={operator.id} className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg text-foreground mb-2">
                      {operator.full_name}
                    </CardTitle>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        operator.is_active 
                          ? 'bg-green-dark/20 text-green-medium border border-green-dark/30' 
                          : 'bg-red-600/20 text-red-400 border border-red-600/30'
                      }`}>
                        {operator.is_active ? 'Activo' : 'Inactivo'}
                      </span>
                      {isExamExpiringSoon && operator.is_active && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-600/20 text-orange-400 border border-orange-600/30">
                          Examen por vencer
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-400">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <IdCard className="h-4 w-4" />
                  <span>RUT: {operator.rut}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{operator.phone}</span>
                </div>

                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <IdCard className="h-4 w-4" />
                  <span>Licencia: {operator.license_number}</span>
                </div>

                <div className="border-t border-border/30 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Venc. Examen:
                    </span>
                    <span className={`text-sm font-medium ${
                      isExamExpiringSoon 
                        ? 'text-orange-400' 
                        : 'text-foreground'
                    }`}>
                      {new Date(operator.exam_expiry_date).toLocaleDateString('es-CL')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
