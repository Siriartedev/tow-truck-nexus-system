import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  UserCheck,
  Star,
  Download,
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';
import { usePDFGenerator } from '@/hooks/usePDFGenerator';
import type { OperatorReportData } from '@/types/reports';

export default function OperatorsReport() {
  const operatorsData = [
    {
      id: '1',
      name: 'Juan Pérez',
      services: 45,
      commissions: 67500,
      rating: 4.8,
      efficiency: 96
    },
    {
      id: '2',
      name: 'Carlos López',
      services: 38,
      commissions: 57000,
      rating: 4.6,
      efficiency: 94
    }
  ];

  const { generateOperatorsReport } = usePDFGenerator();

  const mockOperatorsReportData: OperatorReportData[] = operatorsData.map(op => ({
    operator_id: op.id,
    operator_name: op.name,
    services_count: op.services,
    total_commissions: op.commissions,
    total_revenue: op.commissions * 10,
    performance_rating: op.rating
  }));

  const exportReport = async () => {
    try {
      await generateOperatorsReport(mockOperatorsReportData);
    } catch (error) {
      console.error('Error exporting operators report:', error);
      toast.error('Error al exportar el reporte de operadores');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-foreground">Reporte de Operadores</h3>
          <p className="text-muted-foreground">Desempeño y comisiones de operadores</p>
        </div>
        <Button variant="outline" onClick={exportReport}>
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-foreground">Rendimiento por Operador</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Operador</TableHead>
                <TableHead>Servicios</TableHead>
                <TableHead>Comisiones</TableHead>
                <TableHead>Calificación</TableHead>
                <TableHead>Eficiencia</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {operatorsData.map((operator) => (
                <TableRow key={operator.id}>
                  <TableCell className="font-medium">{operator.name}</TableCell>
                  <TableCell>{operator.services}</TableCell>
                  <TableCell>${operator.commissions.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span>{operator.rating}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-green-600">{operator.efficiency}%</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
