
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Truck,
  Activity,
  Download,
  Gauge
} from 'lucide-react';

export default function CranesReport() {
  const cranesData = [
    {
      id: '1',
      identifier: 'GRUA-001',
      brand: 'Liebherr',
      model: 'LTM 1090-4.2',
      services: 28,
      utilization: 85,
      revenue: 1260000,
      status: 'active' as const
    },
    {
      id: '2',
      identifier: 'GRUA-002',
      brand: 'Tadano',
      model: 'ATF 70G-4',
      services: 22,
      utilization: 67,
      revenue: 924000,
      status: 'active' as const
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-foreground">Reporte de Grúas</h3>
          <p className="text-muted-foreground">Utilización y rendimiento del equipo</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-foreground">Rendimiento por Grúa</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Identificador</TableHead>
                <TableHead>Marca/Modelo</TableHead>
                <TableHead>Servicios</TableHead>
                <TableHead>Utilización</TableHead>
                <TableHead>Ingresos</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cranesData.map((crane) => (
                <TableRow key={crane.id}>
                  <TableCell className="font-medium">{crane.identifier}</TableCell>
                  <TableCell>{crane.brand} {crane.model}</TableCell>
                  <TableCell>{crane.services}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Gauge className="h-4 w-4 text-blue-500" />
                      <span>{crane.utilization}%</span>
                    </div>
                  </TableCell>
                  <TableCell>${crane.revenue.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge className="bg-green-600">Activa</Badge>
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
