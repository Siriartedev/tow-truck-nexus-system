
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Camera, PenTool, CheckCircle } from 'lucide-react';
import { Service } from '@/types/services';
import { OperatorAuth, ServiceInspection } from '@/types/operator-portal';
import VehicleInventory from '../VehicleInventory';
import PhotoCapture from '../PhotoCapture';
import DigitalSignatures from '../DigitalSignatures';

interface InspectionTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  inspection: ServiceInspection;
  setInspection: (inspection: ServiceInspection) => void;
  operatorName: string;
}

export default function InspectionTabs({ 
  activeTab, 
  setActiveTab, 
  inspection, 
  setInspection, 
  operatorName 
}: InspectionTabsProps) {
  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'inventory': return <FileText className="h-4 w-4" />;
      case 'photos': return <Camera className="h-4 w-4" />;
      case 'signatures': return <PenTool className="h-4 w-4" />;
      default: return null;
    }
  };

  const getCompletionStatus = (tab: string) => {
    switch (tab) {
      case 'inventory':
        return inspection.inspection_items.some(item => item.checked);
      case 'photos':
        return inspection.photos.length >= 1;
      case 'signatures':
        return inspection.signatures.operator && inspection.signatures.client;
      default:
        return false;
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-6">
        {['inventory', 'photos', 'signatures'].map((tab) => (
          <TabsTrigger key={tab} value={tab} className="flex items-center space-x-2 relative">
            {getTabIcon(tab)}
            <span className="capitalize">
              {tab === 'inventory' ? 'Inventario' : 
               tab === 'photos' ? 'Fotografías' : 'Firmas'}
            </span>
            {getCompletionStatus(tab) && (
              <CheckCircle className="h-3 w-3 text-green-600 absolute -top-1 -right-1" />
            )}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="inventory">
        <VehicleInventory 
          inspection={inspection}
          onUpdate={setInspection}
          onNext={() => setActiveTab('photos')}
        />
      </TabsContent>

      <TabsContent value="photos">
        <PhotoCapture 
          inspection={inspection}
          onUpdate={setInspection}
          onNext={() => setActiveTab('signatures')}
          onPrevious={() => setActiveTab('inventory')}
        />
      </TabsContent>

      <TabsContent value="signatures">
        <DigitalSignatures 
          inspection={inspection}
          onUpdate={setInspection}
          onPrevious={() => setActiveTab('photos')}
          operatorName={operatorName}
        />
      </TabsContent>
    </Tabs>
  );
}
