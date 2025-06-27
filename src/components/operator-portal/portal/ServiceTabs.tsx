
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Home, Clock, CheckCircle } from 'lucide-react';
import { Service } from '@/types/services';
import ServiceCard from './ServiceCard';

interface ServiceTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  assignedServices: Service[];
  activeServices: Service[];
  completedServices: Service[];
  onServiceClick: (service: Service) => void;
}

export default function ServiceTabs({ 
  activeTab, 
  setActiveTab, 
  assignedServices, 
  activeServices, 
  completedServices, 
  onServiceClick 
}: ServiceTabsProps) {
  const renderEmptyState = (message: string) => (
    <div className="col-span-full text-center py-8">
      <p className="text-muted-foreground">{message}</p>
    </div>
  );

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-8">
        <TabsTrigger value="assigned" className="flex items-center space-x-2">
          <Home className="h-4 w-4" />
          <span>Asignados ({assignedServices.length})</span>
        </TabsTrigger>
        <TabsTrigger value="active" className="flex items-center space-x-2">
          <Clock className="h-4 w-4" />
          <span>Activos ({activeServices.length})</span>
        </TabsTrigger>
        <TabsTrigger value="completed" className="flex items-center space-x-2">
          <CheckCircle className="h-4 w-4" />
          <span>Completados ({completedServices.length})</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="assigned">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {assignedServices.map((service) => (
            <ServiceCard key={service.id} service={service} onClick={onServiceClick} />
          ))}
          {assignedServices.length === 0 && renderEmptyState('No tienes servicios asignados')}
        </div>
      </TabsContent>

      <TabsContent value="active">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {activeServices.map((service) => (
            <ServiceCard key={service.id} service={service} onClick={onServiceClick} />
          ))}
          {activeServices.length === 0 && renderEmptyState('No tienes servicios activos')}
        </div>
      </TabsContent>

      <TabsContent value="completed">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {completedServices.map((service) => (
            <ServiceCard key={service.id} service={service} onClick={onServiceClick} />
          ))}
          {completedServices.length === 0 && renderEmptyState('No tienes servicios completados')}
        </div>
      </TabsContent>
    </Tabs>
  );
}
