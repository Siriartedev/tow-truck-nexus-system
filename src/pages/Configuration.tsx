
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building, 
  Settings, 
  Bell, 
  Users, 
  Save,
  Shield
} from 'lucide-react';
import CompanyConfiguration from '@/components/configuration/CompanyConfiguration';
import SystemConfiguration from '@/components/configuration/SystemConfiguration';
import NotificationConfiguration from '@/components/configuration/NotificationConfiguration';
import UserManagement from '@/components/configuration/UserManagement';

export default function Configuration() {
  const [activeTab, setActiveTab] = useState('company');

  const configSections = [
    {
      id: 'company',
      name: 'Empresa',
      description: 'Configuración de datos de la empresa',
      icon: Building,
      color: 'text-blue-500'
    },
    {
      id: 'system',
      name: 'Sistema',
      description: 'Configuraciones técnicas y respaldos',
      icon: Settings,
      color: 'text-green-500'
    },
    {
      id: 'notifications',
      name: 'Notificaciones',
      description: 'Configuración de alertas y notificaciones',
      icon: Bell,
      color: 'text-yellow-500'
    },
    {
      id: 'users',
      name: 'Usuarios',
      description: 'Gestión de usuarios y permisos',
      icon: Users,
      color: 'text-purple-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Configuración del Sistema</h1>
          <p className="text-muted-foreground">
            Administra la configuración general del sistema TMS Grúas
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-green-medium" />
          <span className="text-sm text-muted-foreground">Panel de Administración</span>
        </div>
      </div>

      {/* Configuration Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
          {configSections.map((section) => {
            const Icon = section.icon;
            return (
              <TabsTrigger 
                key={section.id} 
                value={section.id}
                className="flex items-center space-x-2 data-[state=active]:bg-green-medium/20"
              >
                <Icon className={`h-4 w-4 ${section.color}`} />
                <span className="hidden sm:inline">{section.name}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* Company Configuration */}
        <TabsContent value="company" className="space-y-6">
          <CompanyConfiguration />
        </TabsContent>

        {/* System Configuration */}
        <TabsContent value="system" className="space-y-6">
          <SystemConfiguration />
        </TabsContent>

        {/* Notifications Configuration */}
        <TabsContent value="notifications" className="space-y-6">
          <NotificationConfiguration />
        </TabsContent>

        {/* User Management */}
        <TabsContent value="users" className="space-y-6">
          <UserManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
