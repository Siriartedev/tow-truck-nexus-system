
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Building, 
  Save, 
  Upload, 
  Eye,
  FileText,
  Hash
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function CompanyConfiguration() {
  const { toast } = useToast();
  const [companyData, setCompanyData] = useState({
    name: 'TMS Grúas Ltda.',
    rut: '12.345.678-9',
    address: 'Av. Principal 123, Santiago, Chile',
    phone: '+56 2 2345 6789',
    email: 'contacto@tmsgruas.cl',
    folio_format: 'TMS-{YYYY}-{MM}-{NNNN}',
    next_folio: 1001,
    logo_url: ''
  });

  const handleInputChange = (field: string, value: string | number) => {
    setCompanyData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // Aquí se implementaría la lógica para guardar en la base de datos
    toast({
      title: "Configuración guardada",
      description: "Los datos de la empresa han sido actualizados correctamente.",
    });
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Aquí se implementaría la lógica para subir el archivo
      toast({
        title: "Logo cargado",
        description: "El logo de la empresa ha sido actualizado.",
      });
    }
  };

  const previewFolio = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const folioNumber = String(companyData.next_folio).padStart(4, '0');
    
    return companyData.folio_format
      .replace('{YYYY}', year.toString())
      .replace('{MM}', month)
      .replace('{NNNN}', folioNumber);
  };

  return (
    <div className="space-y-6">
      {/* Company Info Card */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building className="h-5 w-5 text-blue-500" />
            <span>Información de la Empresa</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="company-name">Nombre de la Empresa</Label>
              <Input
                id="company-name"
                value={companyData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Nombre de la empresa"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company-rut">RUT</Label>
              <Input
                id="company-rut"
                value={companyData.rut}
                onChange={(e) => handleInputChange('rut', e.target.value)}
                placeholder="12.345.678-9"
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="company-address">Dirección</Label>
              <Input
                id="company-address"
                value={companyData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Dirección completa"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company-phone">Teléfono</Label>
              <Input
                id="company-phone"
                value={companyData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+56 2 2345 6789"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company-email">Email</Label>
              <Input
                id="company-email"
                type="email"
                value={companyData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="contacto@empresa.cl"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Folio Configuration */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-green-500" />
            <span>Configuración de Folios</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="folio-format">Formato de Folio</Label>
              <Input
                id="folio-format"
                value={companyData.folio_format}
                onChange={(e) => handleInputChange('folio_format', e.target.value)}
                placeholder="TMS-{YYYY}-{MM}-{NNNN}"
              />
              <p className="text-xs text-muted-foreground">
                Variables: {'{YYYY}'} = Año, {'{MM}'} = Mes, {'{NNNN}'} = Número correlativo
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="next-folio">Próximo Folio</Label>
              <Input
                id="next-folio"
                type="number"
                value={companyData.next_folio}
                onChange={(e) => handleInputChange('next_folio', parseInt(e.target.value))}
                min="1"
              />
            </div>
          </div>
          
          <div className="bg-muted/30 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Eye className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Vista Previa del Próximo Folio:</span>
            </div>
            <div className="font-mono text-lg font-bold text-green-medium">
              {previewFolio()}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logo Configuration */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5 text-purple-500" />
            <span>Logo de la Empresa</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-24 h-24 border-2 border-dashed border-border rounded-lg flex items-center justify-center bg-muted/30">
              {companyData.logo_url ? (
                <img 
                  src={companyData.logo_url} 
                  alt="Logo empresa" 
                  className="w-full h-full object-contain rounded-lg"
                />
              ) : (
                <Building className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="logo-upload">Subir Logo</Label>
              <Input
                id="logo-upload"
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="cursor-pointer"
              />
              <p className="text-xs text-muted-foreground">
                Formatos soportados: PNG, JPG, SVG. Tamaño máximo: 2MB
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-gradient-green hover:bg-gradient-green-hover">
          <Save className="h-4 w-4 mr-2" />
          Guardar Configuración
        </Button>
      </div>
    </div>
  );
}
