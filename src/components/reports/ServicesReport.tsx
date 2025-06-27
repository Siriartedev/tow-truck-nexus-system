import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Download
} from 'lucide-react';
import { toast } from 'sonner';
import { usePDFGenerator } from '@/hooks/usePDFGenerator';
import { ServiceReportItem } from '@/types/reports';

export default function ServicesReport() {
  // Mock data
  const servicesStats = {
    total: 156,
    completed: 134,
    inProgress: 12,
    pending: 8,
    cancelled: 2,
    avgCompletionTime: 4.2,
    satisfactionRate: 96
  };

  const recentServices = [
    {
      id: '1',
      folio: 'SVC-20241220-001',
      client: 'Constructora ABC',
      type: 'Montaje Industrial',
      status: 'completed' as const,
      date: '2024-12-20',
      amount: 450000
    },
    // Más servicios...
  ];

  // Agregar el hook de generación de PDFs
  const { generateServicesReport } = usePDFGenerator();

  // Mock data expandido para el reporte
  const mockServicesData: ServiceReportItem[] = [
    {
      id: '1',
      folio: 'SVC-20241220-001',
      client_name: 'Constructora ABC',
      service_type: 'Montaje Industrial',
      crane_brand: 'Liebherr',
      crane_model: 'LTM 1090-4.2',
      crane_license_plate: 'GRUA-001',
      origin: 'Bodega Central, Santiago',
      destination: 'Obra Torre Norte, Las Condes',
      observations: 'Montaje exitoso',
      service_date: '2024-12-20',
      status: 'completed' as const,
      amount: 450000,
      operator_name: 'Juan Pérez'
    },
    {
      id: '2',
      folio: 'SVC-20241219-002',
      client_name: 'Transportes XYZ',
      service_type: 'Transporte Especial',
      crane_brand: 'Tadano',
      crane_model: 'ATF 70G-4',
      crane_license_plate: 'GRUA-002',
      origin: 'Puerto Valparaíso',
      destination: 'Planta Industrial, Santiago',
      observations: 'Transporte completado sin incidentes',
      service_date: '2024-12-19',
      status: 'completed' as const,
      amount: 320000,
      operator_name: 'Carlos López'
    }
  ];

  const exportReport = async () => {
    try {
      await generateServicesReport(mockServicesData, {
        date_from: '2024-12-01',
        date_to: new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      console.error('Error exporting services report:', error);
      toast.error('Error al exportar el reporte de servicios');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-foreground">Reporte de Servicios</h3>
          <p className="text-muted-foreground">Vista general de todos los servicios</p>
        </div>
        <Button variant="outline" onClick={exportReport}>
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-green-dark/20 bg-green-dark/5">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-green-light">
              <CheckCircle className="h-5 w-5 text-green-medium" />
              <span>Completados</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-medium">{servicesStats.completed}</div>
            <p className="text-sm text-muted-foreground">
              {((servicesStats.completed / servicesStats.total) * 100).toFixed(1)}% del total
            </p>
          </CardContent>
        </Card>

        <Card className="border-yellow-600/20 bg-yellow-600/5">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-yellow-400">
              <Clock className="h-5 w-5 text-yellow-500" />
              <span>En Progreso</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-500">{servicesStats.inProgress}</div>
            <p className="text-sm text-muted-foreground">Servicios activos</p>
          </CardContent>
        </Card>

        <Card className="border-blue-600/20 bg-blue-600/5">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-blue-400">
              <FileText className="h-5 w-5 text-blue-500" />
              <span>Pendientes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-500">{servicesStats.pending}</div>
            <p className="text-sm text-muted-foreground">Por iniciar</p>
          </CardContent>
        </Card>

        <Card className="border-red-600/20 bg-red-600/5">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-red-400">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span>Cancelados</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">{servicesStats.cancelled}</div>
            <p className="text-sm text-muted-foreground">Este período</p>
          </CardContent>
        </Card>
      </div>

      {/* Services Table */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-foreground">Servicios Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Folio</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Monto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentServices.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">{service.folio}</TableCell>
                  <TableCell>{service.client}</TableCell>
                  <TableCell>{service.type}</TableCell>
                  <TableCell>{new Date(service.date).toLocaleDateString('es-ES')}</TableCell>
                  <TableCell>
                    <Badge className="bg-green-600">Completado</Badge>
                  </TableCell>
                  <TableCell className="text-right">${service.amount.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
