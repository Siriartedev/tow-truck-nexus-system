
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Database, 
  Save, 
  Shield, 
  Activity,
  Clock,
  HardDrive
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function SystemConfiguration() {
  const { toast } = useToast();
  const [systemConfig, setSystemConfig] = useState({
    backup_enabled: true,
    backup_frequency: 'daily' as 'daily' | 'weekly' | 'monthly',
    backup_retention_days: 30,
    auto_backup_time: '02:00',
    database_optimization: true,
    log_retention_days: 90,
    performance_monitoring: true
  });

  const handleConfigChange = (field: string, value: boolean | string | number) => {
    setSystemConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    toast({
      title: "Configuración guardada",
      description: "La configuración del sistema ha sido actualizada correctamente.",
    });
  };

  const handleManualBackup = () => {
    toast({
      title: "Respaldo iniciado",
      description: "El respaldo manual ha comenzado. Se notificará cuando termine.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Backup Configuration */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5 text-blue-500" />
            <span>Configuración de Respaldos</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Respaldos Automáticos</Label>
              <p className="text-sm text-muted-foreground">
                Activar respaldos automáticos de la base de datos
              </p>
            </div>
            <Switch
              checked={systemConfig.backup_enabled}
              onCheckedChange={(checked) => handleConfigChange('backup_enabled', checked)}
            />
          </div>

          {systemConfig.backup_enabled && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
              <div className="space-y-2">
                <Label htmlFor="backup-frequency">Frecuencia</Label>
                <select
                  id="backup-frequency"
                  value={systemConfig.backup_frequency}
                  onChange={(e) => handleConfigChange('backup_frequency', e.target.value)}
                  className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
                >
                  <option value="daily">Diario</option>
                  <option value="weekly">Semanal</option>
                  <option value="monthly">Mensual</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="backup-time">Hora de Respaldo</Label>
                <Input
                  id="backup-time"
                  type="time"
                  value={systemConfig.auto_backup_time}
                  onChange={(e) => handleConfigChange('auto_backup_time', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="retention-days">Retención (días)</Label>
                <Input
                  id="retention-days"
                  type="number"
                  value={systemConfig.backup_retention_days}
                  onChange={(e) => handleConfigChange('backup_retention_days', parseInt(e.target.value))}
                  min="1"
                  max="365"
                />
              </div>
            </div>
          )}

          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={handleManualBackup}
              className="border-blue-500 text-blue-600 hover:bg-blue-50"
            >
              <HardDrive className="h-4 w-4 mr-2" />
              Crear Respaldo Manual
            </Button>
            <span className="text-sm text-muted-foreground">
              Último respaldo: Hoy a las 02:00
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Database Optimization */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-green-500" />
            <span>Optimización de Base de Datos</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Optimización Automática</Label>
              <p className="text-sm text-muted-foreground">
                Optimizar automáticamente la base de datos para mejor rendimiento
              </p>
            </div>
            <Switch
              checked={systemConfig.database_optimization}
              onCheckedChange={(checked) => handleConfigChange('database_optimization', checked)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="log-retention">Retención de Logs (días)</Label>
            <Input
              id="log-retention"
              type="number"
              value={systemConfig.log_retention_days}
              onChange={(e) => handleConfigChange('log_retention_days', parseInt(e.target.value))}
              min="7"
              max="365"
            />
            <p className="text-xs text-muted-foreground">
              Los logs más antiguos se eliminarán automáticamente
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Performance Monitoring */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-purple-500" />
            <span>Monitoreo de Rendimiento</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Monitoreo Activo</Label>
              <p className="text-sm text-muted-foreground">
                Supervisar el rendimiento del sistema y generar alertas
              </p>
            </div>
            <Switch
              checked={systemConfig.performance_monitoring}
              onCheckedChange={(checked) => handleConfigChange('performance_monitoring', checked)}
            />
          </div>

          {systemConfig.performance_monitoring && (
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-500">98%</div>
                  <div className="text-xs text-muted-foreground">Disponibilidad</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-500">45ms</div>
                  <div className="text-xs text-muted-foreground">Tiempo Respuesta</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-500">2.1GB</div>
                  <div className="text-xs text-muted-foreground">Memoria Usada</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-500">15%</div>
                  <div className="text-xs text-muted-foreground">Uso CPU</div>
                </div>
              </div>
            </div>
          )}
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
