
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Home, 
  FileText, 
  Plus, 
  Clock, 
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ClientDashboard from '@/components/client-portal/ClientDashboard';
import ServiceHistory from '@/components/client-portal/ServiceHistory';
import ServiceRequest from '@/components/client-portal/ServiceRequest';
import ActiveServices from '@/components/client-portal/ActiveServices';

export default function ClientPortal() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Sistema
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Portal Cliente</h1>
              <p className="text-sm text-muted-foreground">Constructora ABC S.A. de C.V.</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <Home className="h-4 w-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Historial</span>
            </TabsTrigger>
            <TabsTrigger value="request" className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Solicitar</span>
            </TabsTrigger>
            <TabsTrigger value="active" className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Activos</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <ClientDashboard />
          </TabsContent>

          <TabsContent value="history">
            <ServiceHistory />
          </TabsContent>

          <TabsContent value="request">
            <ServiceRequest />
          </TabsContent>

          <TabsContent value="active">
            <ActiveServices />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
