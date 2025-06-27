import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart3,
  Users,
  DollarSign,
  FileText,
  TrendingUp,
  Truck,
  UserCheck,
  Download,
  Calendar,
  Building,
  ArrowLeft
} from 'lucide-react';
import ClientReport from '@/components/reports/ClientReport';
import ServicesReport from '@/components/reports/ServicesReport';
import FinancialReport from '@/components/reports/FinancialReport';
import OperatorsReport from '@/components/reports/OperatorsReport';
import CranesReport from '@/components/reports/CranesReport';
import { usePDFGenerator } from '@/hooks/usePDFGenerator';

type ReportType = 'client' | 'services' | 'financial' | 'operators' | 'cranes' | 'dashboard';

export default function Reports() {
  const [activeReport, setActiveReport] = useState<ReportType>('dashboard');

  // Agregar el hook de generación de PDFs
  const { 
    generateClientReport, 
    generateServicesReport, 
    generateFinancialReport, 
    generateOperatorsReport, 
    generateCranesReport 
  } = usePDFGenerator();

  // Mock data para el dashboard
  const dashboardStats = {
    totalRevenue: 2450000,
    monthlyServices: 156,
    activeClients: 45,
    cranesUtilization: 78,
    topClient: 'Constructora ABC',
    topOperator: 'Juan Pérez',
    avgServiceValue: 15700,
    completionRate: 94
  };

  const reportTypes = [
    {
      id: 'client' as ReportType,
      name: 'Reporte por Cliente',
      description: 'Servicios detallados por cliente y período',
      icon: Building,
      color: 'text-blue-500'
    },
    {
      id: 'services' as ReportType,
      name: 'Reporte de Servicios',
      description: 'Vista general de servicios por período',
      icon: FileText,
      color: 'text-green-500'
    },
    {
      id: 'financial' as ReportType,
      name: 'Reporte Financiero',
      description: 'Análisis de ingresos y comisiones',
      icon: DollarSign,
      color: 'text-yellow-500'
    },
    {
      id: 'operators' as ReportType,
      name: 'Reporte de Operadores',
      description: 'Desempeño y comisiones de operadores',
      icon: UserCheck,
      color: 'text-purple-500'
    },
    {
      id: 'cranes' as ReportType,
      name: 'Reporte de Grúas',
      description: 'Utilización y eficiencia de grúas',
      icon: Truck,
      color: 'text-red-500'
    }
  ];

  // Función para exportar reporte completo
  const exportAllReports = async () => {
    try {
      toast.info('Generando reporte completo...');
      
      // Generar todos los reportes con datos mock
      const promises = [
        generateFinancialReport({
          period: 'Diciembre 2024',
          total_revenue: dashboardStats.totalRevenue,
          total_commissions: dashboardStats.totalRevenue * 0.1,
          net_profit: dashboardStats.totalRevenue * 0.9,
          services_count: dashboardStats.monthlyServices,
          clients_count: dashboardStats.activeClients
        }),
        generateServicesReport([], {
          date_from: '2024-12-01',
          date_to: new Date().toISOString().split('T')[0]
        }),
        generateOperatorsReport([]),
        generateCranesReport([])
      ];
      
      await Promise.all(promises);
      toast.success('Todos los reportes han sido generados');
    } catch (error) {
      console.error('Error generating all reports:', error);
      toast.error('Error al generar los reportes');
    }
  };

  const renderActiveReport = () => {
    switch (activeReport) {
      case 'client':
        return <ClientReport />;
      case 'services':
        return <ServicesReport />;
      case 'financial':
        return <FinancialReport />;
      case 'operators':
        return <OperatorsReport />;
      case 'cranes':
        return <CranesReport />;
      default:
        return renderDashboard();
    }
  };

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Reportes y Análisis</h1>
          <p className="text-muted-foreground">
            Dashboard de reportes - Última actualización: {new Date().toLocaleString()}
          </p>
        </div>
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            className="border-green-medium hover:bg-green-dark/10"
            onClick={exportAllReports}
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar Todo
          </Button>
          <Button className="bg-gradient-green hover:bg-gradient-green-hover">
            <BarChart3 className="h-4 w-4 mr-2" />
            Generar Reporte Completo
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ingresos Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-green-medium" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-medium">
              ${dashboardStats.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-green-light mt-1">+15% vs mes anterior</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Servicios del Mes</CardTitle>
            <FileText className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{dashboardStats.monthlyServices}</div>
            <p className="text-xs text-blue-400 mt-1">{dashboardStats.completionRate}% completados</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Clientes Activos</CardTitle>
            <Users className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{dashboardStats.activeClients}</div>
            <p className="text-xs text-purple-400 mt-1">Cliente top: {dashboardStats.topClient}</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Utilización Grúas</CardTitle>
            <Truck className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{dashboardStats.cranesUtilization}%</div>
            <p className="text-xs text-red-400 mt-1">Promedio mensual</p>
          </CardContent>
        </Card>
      </div>

      {/* Report Types Grid */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">Tipos de Reportes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportTypes.map((report) => {
            const Icon = report.icon;
            return (
              <Card 
                key={report.id} 
                className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all cursor-pointer hover:scale-105"
                onClick={() => setActiveReport(report.id)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <Icon className={`h-6 w-6 ${report.color}`} />
                    <span className="text-foreground">{report.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{report.description}</p>
                  <Button variant="outline" size="sm" className="w-full">
                    Ver Reporte
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-medium" />
              <span>Métricas Clave</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Valor promedio por servicio</span>
              <span className="font-bold text-green-medium">${dashboardStats.avgServiceValue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Tasa de completación</span>
              <span className="font-bold text-blue-400">{dashboardStats.completionRate}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Operador destacado</span>
              <span className="font-bold text-foreground">{dashboardStats.topOperator}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-400" />
              <span>Acciones Rápidas</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start border-green-dark/30 hover:bg-green-dark/10"
              onClick={() => setActiveReport('client')}
            >
              <Building className="h-4 w-4 mr-2 text-green-medium" />
              Generar Reporte por Cliente
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start border-blue-600/30 hover:bg-blue-600/10"
              onClick={() => setActiveReport('financial')}
            >
              <DollarSign className="h-4 w-4 mr-2 text-blue-400" />
              Análisis Financiero
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start border-purple-600/30 hover:bg-purple-600/10"
              onClick={() => setActiveReport('operators')}
            >
              <UserCheck className="h-4 w-4 mr-2 text-purple-400" />
              Desempeño Operadores
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {activeReport !== 'dashboard' && (
        <div className="flex items-center space-x-4 pb-4 border-b border-border/50">
          <Button 
            variant="outline" 
            onClick={() => setActiveReport('dashboard')}
            className="border-green-medium text-green-dark hover:bg-green-light/20"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Reportes
          </Button>
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-green-medium" />
            <h2 className="text-2xl font-bold text-foreground">
              {reportTypes.find(r => r.id === activeReport)?.name || 'Reporte'}
            </h2>
          </div>
        </div>
      )}
      
      {renderActiveReport()}
    </div>
  );
}
