import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  Search,
  Download,
  Calendar as CalendarIcon,
  Building,
  DollarSign,
  FileText,
  Filter
} from 'lucide-react';
import type { ClientReportData, ServiceReportItem, ReportFilters } from '@/types/reports';
import { usePDFGenerator } from '@/hooks/usePDFGenerator';
import { toast } from 'sonner';

export default function ClientReport() {
  const [filters, setFilters] = useState<ReportFilters>({
    date_from: format(new Date(2024, 11, 1), 'yyyy-MM-dd'),
    date_to: format(new Date(), 'yyyy-MM-dd')
  });
  const [dateFrom, setDateFrom] = useState<Date>(new Date(2024, 11, 1));
  const [dateTo, setDateTo] = useState<Date>(new Date());
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [reportData, setReportData] = useState<ClientReportData | null>(null);

  // Agregar el hook de generación de PDFs
  const { generateClientReport } = usePDFGenerator();

  // Mock data - clientes disponibles
  const availableClients = [
    { id: '1', name: 'Constructora ABC' },
    { id: '2', name: 'Transportes XYZ' },
    { id: '3', name: 'Empresa Industrial DEF' },
    { id: '4', name: 'Minera Norte' },
    { id: '5', name: 'Constructora Sur' }
  ];

  // Mock data - servicios del cliente
  const mockServices: ServiceReportItem[] = [
    {
      id: '1',
      folio: 'SVC-20241201-001',
      client_name: 'Constructora ABC',
      service_type: 'Montaje Industrial',
      crane_brand: 'Liebherr',
      crane_model: 'LTM 1090-4.2',
      crane_license_plate: 'GRUA-001',
      origin: 'Bodega Central, Santiago',
      destination: 'Obra Torre Norte, Las Condes',
      observations: 'Montaje de estructura de acero, requiere coordinar con obra civil',
      service_date: '2024-12-01',
      status: 'completed',
      amount: 450000,
      operator_name: 'Juan Pérez'
    },
    {
      id: '2',
      folio: 'SVC-20241203-005',
      client_name: 'Constructora ABC',
      service_type: 'Transporte Especial',
      crane_brand: 'Tadano',
      crane_model: 'ATF 70G-4',
      crane_license_plate: 'GRUA-003',
      origin: 'Planta Providencia, Santiago',
      destination: 'Sitio Construcción, Maipú',
      observations: 'Transporte de prefabricados hormigón, carga frágil',
      service_date: '2024-12-03',
      status: 'completed',
      amount: 280000,
      operator_name: 'Carlos López'
    },
    {
      id: '3',
      folio: 'SVC-20241207-012',
      client_name: 'Constructora ABC',
      service_type: 'Montaje Industrial',
      crane_brand: 'Liebherr',
      crane_model: 'LTM 1090-4.2',
      crane_license_plate: 'GRUA-001',
      origin: 'Depósito San Bernardo',
      destination: 'Proyecto Residencial, Puente Alto',
      observations: 'Instalación de paneles prefabricados, trabajo en altura',
      service_date: '2024-12-07',
      status: 'in_progress',
      amount: 380000,
      operator_name: 'Juan Pérez'
    }
  ];

  const generateReport = () => {
    if (!selectedClient) return;

    const client = availableClients.find(c => c.id === selectedClient);
    if (!client) return;

    // Filtrar servicios por fechas
    const filteredServices = mockServices.filter(service => {
      const serviceDate = new Date(service.service_date);
      return serviceDate >= dateFrom && serviceDate <= dateTo;
    });

    const reportData: ClientReportData = {
      client_id: selectedClient,
      client_name: client.name,
      total_services: filteredServices.length,
      total_amount: filteredServices.reduce((sum, service) => sum + service.amount, 0),
      services: filteredServices
    };

    setReportData(reportData);
  };

  const getStatusBadge = (status: ServiceReportItem['status']) => {
    const statusConfig = {
      completed: { label: 'Completado', variant: 'default' as const, className: 'bg-green-600' },
      in_progress: { label: 'En Progreso', variant: 'secondary' as const, className: 'bg-yellow-600' },
      pending: { label: 'Pendiente', variant: 'outline' as const, className: 'bg-blue-600' },
      cancelled: { label: 'Cancelado', variant: 'destructive' as const, className: 'bg-red-600' }
    };

    const config = statusConfig[status];
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const exportReport = async () => {
    if (!reportData) {
      toast.error('No hay datos para exportar');
      return;
    }
    
    try {
      await generateClientReport(reportData, {
        date_from: filters.date_from,
        date_to: filters.date_to
      });
    } catch (error) {
      console.error('Error exporting report:', error);
      toast.error('Error al exportar el reporte');
    }
  };

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-foreground">
            <Filter className="h-5 w-5 text-green-medium" />
            <span>Filtros de Reporte</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Selector de Cliente */}
            <div className="space-y-2">
              <Label htmlFor="client">Cliente *</Label>
              <select
                id="client"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
              >
                <option value="">Seleccionar cliente</option>
                {availableClients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Fecha Desde */}
            <div className="space-y-2">
              <Label>Fecha Desde *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateFrom && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFrom ? format(dateFrom, "PPP", { locale: es }) : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateFrom}
                    onSelect={(date) => {
                      if (date) {
                        setDateFrom(date);
                        setFilters({ ...filters, date_from: format(date, 'yyyy-MM-dd') });
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Fecha Hasta */}
            <div className="space-y-2">
              <Label>Fecha Hasta *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateTo && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateTo ? format(dateTo, "PPP", { locale: es }) : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateTo}
                    onSelect={(date) => {
                      if (date) {
                        setDateTo(date);
                        setFilters({ ...filters, date_to: format(date, 'yyyy-MM-dd') });
                      }
                    }}
                    initialFocus
                    disabled={(date) => dateFrom ? date < dateFrom : false}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Botón Generar */}
            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button 
                onClick={generateReport}
                disabled={!selectedClient}
                className="w-full bg-gradient-green hover:bg-gradient-green-hover"
              >
                <Search className="h-4 w-4 mr-2" />
                Generar Reporte
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resultados del Reporte */}
      {reportData && (
        <>
          {/* Resumen */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-green-dark/20 bg-green-dark/5 hover:bg-green-dark/10 transition-colors">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-green-light">
                  <Building className="h-5 w-5 text-green-medium" />
                  <span>Cliente</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-medium">{reportData.client_name}</div>
                <p className="text-sm text-muted-foreground mt-1">
                  Período: {format(dateFrom, 'dd/MM/yyyy')} - {format(dateTo, 'dd/MM/yyyy')}
                </p>
              </CardContent>
            </Card>

            <Card className="border-blue-600/20 bg-blue-600/5 hover:bg-blue-600/10 transition-colors">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-blue-400">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <span>Total Servicios</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-500">{reportData.total_services}</div>
                <p className="text-sm text-muted-foreground mt-1">Servicios registrados</p>
              </CardContent>
            </Card>

            <Card className="border-yellow-600/20 bg-yellow-600/5 hover:bg-yellow-600/10 transition-colors">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-yellow-400">
                  <DollarSign className="h-5 w-5 text-yellow-500" />
                  <span>Valor Total</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-500">
                  ${reportData.total_amount.toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground mt-1">Suma total servicios</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabla de Servicios */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-foreground">Detalle de Servicios</CardTitle>
              <Button onClick={exportReport} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar PDF
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Folio</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Grúa</TableHead>
                      <TableHead>Marca/Modelo</TableHead>
                      <TableHead>Patente</TableHead>
                      <TableHead>Origen</TableHead>
                      <TableHead>Destino</TableHead>
                      <TableHead>Operador</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Monto</TableHead>
                      <TableHead>Observaciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reportData.services.map((service) => (
                      <TableRow key={service.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{service.folio}</TableCell>
                        <TableCell>{new Date(service.service_date).toLocaleDateString('es-ES')}</TableCell>
                        <TableCell>{service.service_type}</TableCell>
                        <TableCell>{service.crane_brand}</TableCell>
                        <TableCell>{service.crane_model}</TableCell>
                        <TableCell className="font-mono text-xs">{service.crane_license_plate}</TableCell>
                        <TableCell className="max-w-32 truncate" title={service.origin}>
                          {service.origin}
                        </TableCell>
                        <TableCell className="max-w-32 truncate" title={service.destination}>
                          {service.destination}
                        </TableCell>
                        <TableCell>{service.operator_name}</TableCell>
                        <TableCell>{getStatusBadge(service.status)}</TableCell>
                        <TableCell className="text-right font-medium">
                          ${service.amount.toLocaleString()}
                        </TableCell>
                        <TableCell className="max-w-40 truncate" title={service.observations}>
                          {service.observations}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
