
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Download,
  Calculator
} from 'lucide-react';

export default function FinancialReport() {
  const financialData = {
    totalRevenue: 2450000,
    totalCommissions: 245000,
    netProfit: 2205000,
    monthlyGrowth: 15.2,
    avgServiceValue: 15700,
    profitMargin: 89.2
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-foreground">Reporte Financiero</h3>
          <p className="text-muted-foreground">Análisis de ingresos y rentabilidad</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-green-dark/20 bg-green-dark/5">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-green-light">
              <DollarSign className="h-5 w-5 text-green-medium" />
              <span>Ingresos Totales</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-medium">
              ${financialData.totalRevenue.toLocaleString()}
            </div>
            <div className="flex items-center space-x-1 mt-2">
              <TrendingUp className="h-4 w-4 text-green-light" />
              <span className="text-sm text-green-light">+{financialData.monthlyGrowth}%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-600/20 bg-yellow-600/5">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-yellow-400">
              <Calculator className="h-5 w-5 text-yellow-500" />
              <span>Comisiones</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-500">
              ${financialData.totalCommissions.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground mt-2">10% de ingresos</p>
          </CardContent>
        </Card>

        <Card className="border-blue-600/20 bg-blue-600/5">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-blue-400">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              <span>Ganancia Neta</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-500">
              ${financialData.netProfit.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {financialData.profitMargin}% margen
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
