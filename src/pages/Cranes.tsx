
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Truck, Calendar, Shield, Wrench } from 'lucide-react';
import CreateCraneForm from '@/components/cranes/CreateCraneForm';
import type { Crane } from '@/types/cranes';

export default function Cranes() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  // Mock data - en producción vendría de la API
  const cranes: Crane[] = [
    {
      id: '1',
      license_plate: 'GRUA-01',
      type: 'Liviana',
      brand: 'Mercedes Benz',
      model: 'Atego 1725',
      circulation_permit_expiry: '2025-06-27',
      insurance_expiry: '2025-06-27',
      technical_revision_expiry: '2025-06-27',
      is_active: true,
      created_at: '2024-01-15',
      updated_at: '2024-01-15'
    },
    {
      id: '2',
      license_plate: 'GRUA-02',
      type: 'Pesada',
      brand: 'Volvo',
      model: 'FH16',
      circulation_permit_expiry: '2025-08-15',
      insurance_expiry: '2025-07-20',
      technical_revision_expiry: '2025-09-10',
      is_active: true,
      created_at: '2024-01-10',
      updated_at: '2024-01-10'
    },
    {
      id: '3',
      license_plate: 'GRUA-03',
      type: 'Mediana',
      brand: 'Scania',
      model: 'P320',
      circulation_permit_expiry: '2024-08-20',
      insurance_expiry: '2024-09-15',
      technical_revision_expiry: '2024-07-30',
      is_active: false,
      created_at: '2023-12-05',
      updated_at: '2024-01-05'
    }
  ];

  if (showCreateForm) {
    return (
      <CreateCraneForm 
        onBack={() => setShowCreateForm(false)}
        onSave={(data) => {
          console.log('Saving crane:', data);
          setShowCreateForm(false);
        }}
      />
    );
  }

  const checkExpiry = (date: string) => {
    const expiryDate = new Date(date);
    const now = new Date();
    const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    
    if (expiryDate <= now) return 'expired';
    if (expiryDate <= thirtyDaysFromNow) return 'expiring';
    return 'valid';
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Grúas</h1>
          <p className="text-muted-foreground">
            Gestiona la flota de grúas registradas en el sistema
          </p>
        </div>
        <Button 
          onClick={() => setShowCreateForm(true)}
          className="bg-gradient-green hover:bg-gradient-green-hover"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nueva Grúa
        </Button>
      </div>

      {/* Cranes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cranes.map((crane) => {
          const circulationStatus = checkExpiry(crane.circulation_permit_expiry);
          const insuranceStatus = checkExpiry(crane.insurance_expiry);
          const revisionStatus = checkExpiry(crane.technical_revision_expiry);
          
          const hasWarnings = [circulationStatus, insuranceStatus, revisionStatus].some(status => status === 'expiring' || status === 'expired');
          
          return (
            <Card key={crane.id} className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg text-foreground mb-2 flex items-center">
                      <Truck className="h-5 w-5 mr-2" />
                      {crane.license_plate}
                    </CardTitle>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        crane.is_active 
                          ? 'bg-green-dark/20 text-green-medium border border-green-dark/30' 
                          : 'bg-red-600/20 text-red-400 border border-red-600/30'
                      }`}>
                        {crane.is_active ? 'Activa' : 'Inactiva'}
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-600/20 text-blue-400 border border-blue-600/30">
                        {crane.type}
                      </span>
                      {hasWarnings && crane.is_active && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-600/20 text-orange-400 border border-orange-600/30">
                          Documentos por vencer
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
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Marca:</span>
                    <span className="text-foreground font-medium">{crane.brand}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Modelo:</span>
                    <span className="text-foreground font-medium">{crane.model}</span>
                  </div>
                </div>

                <div className="border-t border-border/30 pt-3 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      Permiso Circulación:
                    </span>
                    <span className={`font-medium ${
                      circulationStatus === 'expired' ? 'text-red-400' :
                      circulationStatus === 'expiring' ? 'text-orange-400' : 'text-green-medium'
                    }`}>
                      {new Date(crane.circulation_permit_expiry).toLocaleDateString('es-CL')}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground flex items-center">
                      <Shield className="h-3 w-3 mr-1" />
                      Seguro:
                    </span>
                    <span className={`font-medium ${
                      insuranceStatus === 'expired' ? 'text-red-400' :
                      insuranceStatus === 'expiring' ? 'text-orange-400' : 'text-green-medium'
                    }`}>
                      {new Date(crane.insurance_expiry).toLocaleDateString('es-CL')}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground flex items-center">
                      <Wrench className="h-3 w-3 mr-1" />
                      Revisión Técnica:
                    </span>
                    <span className={`font-medium ${
                      revisionStatus === 'expired' ? 'text-red-400' :
                      revisionStatus === 'expiring' ? 'text-orange-400' : 'text-green-medium'
                    }`}>
                      {new Date(crane.technical_revision_expiry).toLocaleDateString('es-CL')}
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
