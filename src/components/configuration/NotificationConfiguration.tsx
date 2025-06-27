
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Mail, 
  Save, 
  Bell, 
  AlertTriangle,
  Clock,
  FileText,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function NotificationConfiguration() {
  const { toast } = useToast();
  const [notificationConfig, setNotificationConfig] = useState({
    email_notifications: true,
    service_reminders: true,
    invoice_alerts: true,
    expiry_notifications: true,
    system_updates: false,
    email_frequency: 'immediate' as 'immediate' | 'daily' | 'weekly',
    reminder_days_before: 3
  });

  const handleConfigChange = (field: string, value: boolean | string | number) => {
    setNotificationConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    toast({
      title: "Configuración guardada",
      description: "La configuración de notificaciones ha sido actualizada correctamente.",
    });
  };

  const handleTestEmail = () => {
    toast({
      title: "Email de prueba enviado",
      description: "Revisa tu bandeja de entrada para verificar la configuración.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Email Notifications */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="h-5 w-5 text-blue-500" />
            <span>Notificaciones por Email</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Activar Notificaciones por Email</Label>
              <p className="text-sm text-muted-foreground">
                Recibir notificaciones importantes por correo electrónico
              </p>
            </div>
            <Switch
              checked={notificationConfig.email_notifications}
              onCheckedChange={(checked) => handleConfigChange('email_notifications', checked)}
            />
          </div>

          {notificationConfig.email_notifications && (
            <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
              <div className="space-y-2">
                <Label htmlFor="email-frequency">Frecuencia de Envío</Label>
                <select
                  id="email-frequency"
                  value={notificationConfig.email_frequency}
                  onChange={(e) => handleConfigChange('email_frequency', e.target.value)}
                  className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
                >
                  <option value="immediate">Inmediato</option>
                  <option value="daily">Resumen Diario</option>
                  <option value="weekly">Resumen Semanal</option>
                </select>
              </div>

              <Button 
                variant="outline" 
                onClick={handleTestEmail}
                className="border-blue-500 text-blue-600 hover:bg-blue-50"
              >
                <Mail className="h-4 w-4 mr-2" />
                Enviar Email de Prueba
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Service Reminders */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-green-500" />
            <span>Recordatorios de Servicios</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Recordatorios de Servicios</Label>
              <p className="text-sm text-muted-foreground">
                Notificaciones sobre servicios próximos y vencimientos
              </p>
            </div>
            <Switch
              checked={notificationConfig.service_reminders}
              onCheckedChange={(checked) => handleConfigChange('service_reminders', checked)}
            />
          </div>

          {notificationConfig.service_reminders && (
            <div className="space-y-2">
              <Label htmlFor="reminder-days">Días de Anticipación</Label>
              <Input
                id="reminder-days"
                type="number"
                value={notificationConfig.reminder_days_before}
                onChange={(e) => handleConfigChange('reminder_days_before', parseInt(e.target.value))}
                min="1"
                max="30"
              />
              <p className="text-xs text-muted-foreground">
                Días antes del servicio para enviar recordatorio
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Invoice Alerts */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-yellow-500" />
            <span>Alertas de Facturas</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Alertas de Facturas</Label>
              <p className="text-sm text-muted-foreground">
                Notificaciones sobre facturas vencidas y pagos pendientes
              </p>
            </div>
            <Switch
              checked={notificationConfig.invoice_alerts}
              onCheckedChange={(checked) => handleConfigChange('invoice_alerts', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Expiry Notifications */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <span>Notificaciones de Vencimientos</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Alertas de Vencimientos</Label>
              <p className="text-sm text-muted-foreground">
                Alertas sobre documentos y servicios vencidos
              </p>
            </div>
            <Switch
              checked={notificationConfig.expiry_notifications}
              onCheckedChange={(checked) => handleConfigChange('expiry_notifications', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* System Updates */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <RefreshCw className="h-5 w-5 text-purple-500" />
            <span>Actualizaciones del Sistema</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Notificaciones de Actualizaciones</Label>
              <p className="text-sm text-muted-foreground">
                Notificaciones sobre actualizaciones y mantenimiento del sistema
              </p>
            </div>
            <Switch
              checked={notificationConfig.system_updates}
              onCheckedChange={(checked) => handleConfigChange('system_updates', checked)}
            />
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
